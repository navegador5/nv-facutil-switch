const {
    MODE,
    _build_name,
}  = require("./cmmn");
const cmmn = require("./cmmn");

const {
    DP,
}  = require("nv-facutil-basic");

const {
    DFLT_CASE_MATCHER_PLID,
    is_matcher,
    is_handler,
    is_dflt_case,
    _add_main_handle,
} = require("./nest-share");


const from_kvlist = require("nv-dict-basic").from_kvlist;

const {load_from_json} = require("nv-data-tree-csp-json");

const to_str = require("./nest-stringify");

function _init_cache(rt) {
    let sdfs = rt.$sdfs_
    let matchers = sdfs.filter(nd=>is_matcher(nd))
    let pls = matchers.map(r=>r.$plances_.map(nd=>nd.$id_));
    pls = pls.map(pl=>JSON.stringify(pl))
    pls = pls.map((r,i)=>[r,[]]);
    let arr = sdfs.filter(nd=>is_dflt_case(nd));
    let dflt_pls = arr.map(r=>r.$plances_.map(nd=>nd.$id_));
    dflt_pls = dflt_pls.map(pl=>JSON.stringify(pl));
    dflt_pls = dflt_pls.map((r,i)=>[r,[]]);
    let cache = Object.fromEntries(pls.concat(dflt_pls))
    Object.freeze(cache)
    return(cache)
}


function creat_nest_switch_cache(
    mode,
    entries,
    dflt_handler=(r)=>r,
) {
    let [rt,forest] = load_from_json(entries); 
    class _Cls {
        #show = true
        #cache = _init_cache(rt);
        get dflt_handler_()       {return(dflt_handler)}
        get src_()                {return(entries)}
        get tree_()               {return(rt)}
        get dflt_cases_()         {
            let sdfs = rt.$sdfs_;
            let arr = sdfs.filter(nd=>is_dflt_case(nd));
            let dflt_pls = arr.map(r=>r.$plances_.map(nd=>nd.$id_));
            dflt_pls = dflt_pls.map(pl=>JSON.stringify(pl));
            return(from_kvlist(dflt_pls,arr.map(nd=>{
                let children = nd.$children_;
                let es = children.map(nd=>[nd.key_,nd.value_])
                return(Object.fromEntries(es))
            })))
        }
        get matchers_()           {
            let sdfs = rt.$sdfs_;
            let matchers = sdfs.filter(nd=>is_matcher(nd));
            let pls = matchers.map(r=>r.$plances_.map(nd=>nd.$id_));
            pls = pls.map(pl=>JSON.stringify(pl));
            matchers = matchers.map(nd=>nd.value_);
            let dflt_pls = Object.keys(this.dflt_cases_);
            let dflt_matchers = dflt_pls.map(e=>DFLT_CASE_MATCHER_PLID);
            matchers = matchers.concat(dflt_matchers);
            pls = pls.concat(dflt_pls);
            let rslt = from_kvlist(pls,matchers);
            return(rslt)
        }
        get handlers_()           {
            let sdfs = rt.$sdfs_;
            let handlers = sdfs.filter(nd=>is_handler(nd));
            let pls = handlers.map(r=>r.$plances_.map(nd=>nd.$id_));
            pls = pls.map(pl=>JSON.stringify(pl));
            let rslt = from_kvlist(pls,handlers.map(nd=>nd.value_));
            return(rslt)
        }
        ////
        get group_cache_() {return(this.#cache)}
        reset_group_cache() {
            this.#cache = _init_cache(rt); 
        }
        ////
        get show_flag_()  {return(this.#show)}
        disbale_show()    {this.#show = false}
        enable_show()     {this.#show = true}
        get [Symbol.toStringTag]() {
            if(this.#show) {
                return('\n'+to_str(this)+'\n')
            } else {
                return('...')
            }
        }
    }
    ////
    _build_name(_Cls,mode,'NestSwitchCache','ANestSwitchCache');
    _add_main_handle(true,dflt_handler,_Cls,mode);
    ////
    return(_Cls)
}


module.exports = {
    creat_nest_switch_cache,
    creat_sync_nest_switch_cache:(
        entries,
        dflt_handler=(r)=>r,
    ) => creat_nest_switch_cache(MODE.sync,entries,dflt_handler),
    creat_async_nest_switch_cache:(
        entries,
        dflt_handler=(r)=>r,
    ) => creat_nest_switch_cache(MODE.async,entries,dflt_handler),
}

