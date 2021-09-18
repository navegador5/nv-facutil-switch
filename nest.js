const {
    MODE,
    _build_name,
}  = require("./cmmn");
const cmmn = require("./cmmn");

const {load_from_json ,_Array,_Object} = require("nv-data-tree-csp-json");


const {
    _add_main_handle,
} = require("./nest-share");

const to_str = require("./nest-stringify");

function creat_nest_switch(
    mode,
    entries,
    dflt_handler=cmmn.default_handler,
) {
    let [rt,forest] = load_from_json(entries);
    class _Cls {
        #show = true
        get dflt_handler_()       {return(dflt_handler)}
        get src_()                {return(entries)}
        get tree_()               {return(rt)}
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
    _build_name(_Cls,mode,'NestSwitch','ANestSwitch');
    ////
    _add_main_handle(false,dflt_handler,_Cls,mode);
    ////
    return(_Cls)
}


module.exports = {
    creat_nest_switch,
    creat_sync_nest_switch:(
        entries,
        dflt_handler=(r)=>r,
    ) => creat_nest_switch(MODE.sync,entries,dflt_handler),
    creat_async_nest_switch:(
        entries,
        dflt_handler=(r)=>r,
    ) => creat_nest_switch(MODE.async,entries,dflt_handler),
}
