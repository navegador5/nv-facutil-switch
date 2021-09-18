const ary_findi                 = require("nv-array-find-index");
const dict_bsc                  = require("nv-dict-basic");


const API_COMBOS = [
        [ 'breaker' ],
        [ 'breaker', 'index' ],
        [ 'handler' ],
        [ 'breaker', 'handler' ],
        [ 'breaker', 'handler', 'index' ],
        [ 'handler', 'index' ],
        [ 'index' ],
        [ 'matcher' ],
        [ 'breaker', 'matcher' ],
        [ 'breaker', 'index', 'matcher' ],
        [ 'handler', 'matcher' ],
        [ 'breaker', 'handler', 'matcher' ],
        [ 'breaker', 'handler', 'index', 'matcher' ],
        [ 'handler', 'index', 'matcher' ],
        [ 'index', 'matcher' ],
]

class FullRslt {
    constructor(rslt,index,matcher,handler,breaker) {
        this.rslt = rslt;
        this.index = index;
        this.matcher = matcher;
        this.handler = handler;
        this.breaker = breaker;
    }
    some(...keys) {return(dict_bsc.some(this,...keys))}
}

const MODE = {
    sync:'sync',
    async:'async',
}

function _idxes(o,matchers,handlers,breakers) {
    let rslt = {matcher:[],handler:[],breaker:[]}
    rslt.matcher = ary_findi.all(matchers,r=>r===o);
    rslt.handler = ary_findi.all(handlers,r=>r===o);
    rslt.breaker = ary_findi.all(breakers,r=>r===o);
    return(rslt)
}

const SYM_GET_LST_MATCH_IDX = Symbol("");


const {
    def_cls_instof,
    rename_cls,
}  = require("nv-facutil-basic");

function _build_name(_Cls,mode,sname,aname) {
    let clsname = (mode===MODE.sync)?sname:aname;
    rename_cls(_Cls,clsname);
    def_cls_instof(_Cls,(_Cls,inst)=>inst.constructor.name===clsname);
}


module.exports = {
   API_COMBOS,
   FullRslt,
   MODE,
   SYM_GET_LST_MATCH_IDX, 
   is_default_matcher: (r)=>r===null,
   break:true,
   continue:false,
   default_handler:(r)=>r,
   _idxes,
   _build_name,
}
