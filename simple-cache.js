const {
    API_COMBOS,
    MODE,
    _build_name,
    SYM_GET_LST_MATCH_IDX,
}  = require("./cmmn");
const cmmn = require("./cmmn");

const {
    DP,
}  = require("nv-facutil-basic");

const {
    _add_other_handle,
    _add_main_handle,
} = require("./simple-share");


function _init_cache(matchers) {
     let cache = matchers.map(matcher=>[])
     cache[-1] = [];
     DP(cache,'default',{get:function(){return(this[-1])}});
     Object.freeze(cache)
     return(cache)
}



function creat_simple_switch_cache(
    mode,
    entries,
    dflt_handler=(r)=>r,
    dflt_break=true,
    dflt_default_break=true
) {
    let matchers = entries.map(e=>e[0]);
    let handlers = entries.map(e=>e[1]);
    let breakers = entries.map(e=>e[2]).map(r=>r===undefined?dflt_break:r)
    const lngth = matchers.length;
    class _Cls {
        #lst_match_idx = -2;
        #cache = _init_cache(matchers);
        get [SYM_GET_LST_MATCH_IDX]() {return(this.#lst_match_idx)}
        get matchers_()           {return(matchers.slice(0))}
        get handlers_()           {return(handlers.slice(0))}
        get breakers_()           {return(breakers.slice(0))}
        get dflt_handler_()       {return(dflt_handler)}
        get src_()                {return([entries,dflt_handler])}
        ////
        matcher(i)                 {return(matchers[i])}
        handler(i)                 {return(handlers[i])}
        breaker(i)                 {return(breakers[i])} 
        idxes(o)                   {return(cmmn._idxes(o,matchers,handlers,breakers))}
        ////
        get group_cache_() {return(this.#cache)}
        group(o,mutual_exclusion=true) {
            if(o instanceof Function) {
                let idxes = this.idxes(o).matcher;
                if(mutual_exclusion) {
                   return(this.#cache[idxes[0]])
                } else {
                    return(this.#cache.filter((r,i)=>idxes.includes(i)))
                }
            } else {
                return(this.#cache[o])
            }
        }
        reset_group_cache() {
            this.#cache = matchers.map(matcher=>[]);
            this.#cache[-1] = [];
            this.#lst_match_idx = -2;
        }
        ////
    }
    ////
    _build_name(_Cls,mode,'SimpleSwitchCache','ASimpleSwitchCache');
    _add_main_handle(true,_Cls,mode,lngth,dflt_default_break);
    _add_other_handle(_Cls,mode);
    ////
    return(_Cls)
}


module.exports = {
    creat_simple_switch_cache,
    creat_sync_simple_switch_cache:(
        entries,
        dflt_handler=(r)=>r,
        dflt_break=true,
        dflt_default_break=true
    ) => creat_simple_switch_cache(MODE.sync,entries,dflt_handler,dflt_break,dflt_default_break),
    creat_async_simple_switch_cache:(
        entries,
        dflt_handler=(r)=>r,
        dflt_break=true,
        dflt_default_break=true
    ) => creat_simple_switch_cache(MODE.async,entries,dflt_handler,dflt_break,dflt_default_break),
}

