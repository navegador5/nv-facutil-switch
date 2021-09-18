const {
    MODE,
    _build_name,
}  = require("./cmmn");
const cmmn = require("./cmmn");

const {
    _add_main_handle,
    _add_other_handle,
} = require("./simple-share");


function creat_simple_switch(
    mode,
    entries,
    dflt_handler=cmmn.default_handler,
    dflt_break=true,
) {
    let matchers  = entries.map(e=>e[0]);
    let handlers  = entries.map(e=>e[1]);
    let breakers  = entries.map(e=>e[2]).map(r=>r===undefined?dflt_break:r)
    const lngth   = matchers.length;
    class _Cls {
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
    }
    ////
    _build_name(_Cls,mode,'SimpleSwitch','ASimpleSwitch');
    ////
    _add_main_handle(false,_Cls,mode,lngth);
    _add_other_handle(_Cls,mode);
    ////
    return(_Cls)
}


module.exports = {
    creat_simple_switch,
    creat_sync_simple_switch:(
        entries,
        dflt_handler=(r)=>r,
        dflt_break=true,
    ) => creat_simple_switch(MODE.sync,entries,dflt_handler,dflt_break),
    creat_async_simple_switch:(
        entries,
        dflt_handler=(r)=>r,
        dflt_break=true,
    ) => creat_simple_switch(MODE.async,entries,dflt_handler,dflt_break),
}
