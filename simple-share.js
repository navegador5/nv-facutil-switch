const {
    is_async_func,
    add_method,
}  = require("nv-facutil-basic");


const {
    API_COMBOS,
    MODE,
    FullRslt,
    SYM_GET_LST_MATCH_IDX,
}  = require("./cmmn");


function _handle_default(use_cache,that,rslt,v) {
    //默认必break
    let d = (new FullRslt(rslt,-1,null,that.dflt_handler_));
    if(use_cache) {
        that.group_cache_[-1].push(v);
        that[SYM_GET_LST_MATCH_IDX] = -1;
    } else {}
    return(d)
}


function  _handle(use_cache,that,lngth,v,dflt_default_break) {
    for(let i=0;i<lngth;i++) {
        let matcher = that.matcher(i);
        let cond = matcher(v);
        if(cond) {
            if(use_cache) {that[SYM_GET_LST_MATCH_IDX] = i} else {}
            //处理
            let handler = that.handler(i);
            let rslt = handler(v);
            //匹配就存储
            if(use_cache) {that.group_cache_[i].push(v);} else {}
            let breaker = that.breaker(i);
            if(breaker) { return(new FullRslt(rslt,i,matcher,handler,breaker)) } else {}
        } else {
            //不处理 继续下一条
        }
    }
    let rslt = that.dflt_handler_(v);
    return(_handle_default(use_cache,that,rslt,v))
}


async function  _ahandle(use_cache,that,lngth,v) {
    for(let i=0;i<lngth;i++) {
        let matcher = that.matcher(i);
        ////
        let cond;
        if(is_async_func(matcher)) {
            cond = await matcher(v);
        } else {
            cond = matcher(v);
        }
        ////
        if(cond) {
            //
            if(use_cache) {that[SYM_GET_LST_MATCH_IDX] = i} else {}
            //处理
            let handler = that.handler(i);
            ////
            let rslt;
            if(is_async_func(handler)) {
                rslt = await handler(v);
            } else {
                rslt = handler(v);;
            }
            ////
            let breaker = that.breaker(i);
            if(use_cache) {that.group_cache_[i].push(v);} else {}
            if(breaker) { return(new FullRslt(rslt,i,matcher,handler,breaker))} else {}
        } else {
            //不match 继续下一条
        }
    }
    ////
    let rslt;
    if(is_async_func(that.dflt_handler_)) {
        rslt = await that.dflt_handler_(v);
    } else {
        rslt = that.dflt_handler_(v);
    }
    ////
    return(_handle_default(use_cache,that,rslt,v));
}

function _add_main_handle(use_cache,_Cls,mode,lngth) {
    let feng    = (mode===MODE.sync)?_handle:_ahandle;
    if(mode===MODE.sync) {
        add_method(_Cls,'_handle',function(v){return(feng(use_cache,this,lngth,v))});
        add_method(_Cls,'handle', function(v){return(this._handle(v).rslt)});
    } else {
        add_method(
            _Cls,'_handle',
            async function(v) {
                let r = await feng(use_cache,this,lngth,v);
                return(r)
            }
        );
        add_method(
            _Cls,'handle',
            async function(v) {
                let r = await this._handle(v)
                return(r.rslt)
            }
        );
    }
}

function _add_other_handle(_Cls,mode) {
    for(let e of API_COMBOS) {
        let name = 'handle_rtrn_$'+e.join('_')+'$';
        let _f;
        if(mode===MODE.async){
            _f = async function(v) {
                let full= await this._handle(v);
                return(full.some(...e))
            }
        } else {
            _f = function(v) {
                let full= this._handle(v);
                return(full.some(...e))
            }
        }
        add_method(_Cls,name,_f);
    }

}

module.exports= {
    _handle,
    _ahandle,
    _add_main_handle,
    _add_other_handle
}
