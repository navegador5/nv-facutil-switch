const {
    instof,
    is_async_func,
    add_method,
}  = require("nv-facutil-basic");

const {
    MODE,
}  = require("./cmmn");

const {
    _Array,_Object
} = require("nv-data-tree-csp-json");

const DFLT_CASE_MATCHER_PLID = '___DFLT_MATCHER___';

const is_dflt_case =  (nd) =>  instof(nd,_Object);

const is_matcher   =  (nd) => (nd.value_!== undefined) && instof(nd.value_,Function) && (nd.$sibseq_ === 0);

const is_handler   =  (nd) => (nd.value_!== undefined) && instof(nd.value_,Function) && (nd.$sibseq_ === 1);

const is_completion = (nd) => (nd.value_!== undefined) && (nd.value_ === true);


function _save_to_cache(use_cache,that,matcher_pls,v) {
    if(use_cache) {
        matcher_pls = matcher_pls.$plances_.map(nd=>nd.$id_);
        let k = JSON.stringify(matcher_pls);
        that.group_cache_[k].push(v);
    }
}

function _goto_next_switch(nd) {
    let pnd = nd.$parent_;
    nd = pnd.$rsib_;
    return(nd)
}

function _exec_dflt_case_handler(use_cache,that,matcher_pls,v,handler,dflt_handler) {
    handler = (handler === undefined)?dflt_handler:handler;
    let rslt = handler(v);
    _save_to_cache(use_cache,that,matcher_pls,v);
    return(rslt)
}


function _mani_branch_dflt_case(use_cache,that,matcher_pls,v,nd,rtrn_flag,rslt,dflt_handler) {
    //matcher_pls.push(nd);
    matcher_pls = nd;
    let fstch = nd.$fstch_;
    if(fstch === null) {
        //dflt-switch-entry 为空,默认handler返回原值,默认 compleation break
        rtrn_flag = true;
    } else {
        if(fstch.key_ === 'handler') {
            //如果fstch 是handler
            let handler = fstch.value_;
            rslt = _exec_dflt_case_handler(use_cache,that,matcher_pls,v,handler,dflt_handler);
            //
            let comnd = fstch.$rsib_;
            if(comnd === null) {
                rtrn_flag =true;       //默认completion 后return
            } else {
                rtrn_flag = comnd.value_;
            }
        } else {
            //如果fstch 是completion
            let comnd = fstch;
            let rsib = comnd.$rsib_;
            if(rsib === null) {
                //没有handler
            } else {
                //有handler
                let handler = rsib.value_;
                rslt = _exec_dflt_case_handler(use_cache,that,matcher_pls,v,handler,dflt_handler);
            }
            rtrn_flag  = comnd.value_;
        }
        ////弹出本次matcher路径
        //matcher_pls.pop()
        ////
        nd = _goto_next_switch(nd);
    }
    return([that,matcher_pls,v,nd,rtrn_flag,rslt,dflt_handler])
}


//SYNC


function _next(
    use_cache,
    dflt_handler,      // 兼容dflt-case-switch: {handler:undefined}
    that,v,rslt,nd,
    matcher_pls,
    rtrn_flag,
) {
    if(is_matcher(nd)) {
        //更新matcher 路径
        //matcher_pls.push(nd);
        matcher_pls = nd;
        ////
        let cond =  nd.value_(v);
        if(cond) {
            //matched
            let rsib = nd.$rsib_;
            if(rsib === null) {
                //switch-entry 只有 matcher,默认handler返回原值,默认 compleation break
                rtrn_flag =true;
            } else if(is_completion(rsib)) {
                //[ matcher,completion ]
                rtrn_flag = rsib.value_
            } else if(is_dflt_case(rsib)) {
                throw(`default case can NOT follow matcher`)
            } else if(is_handler(rsib)) {
                //[ matcher, handler,<...>]
                let handler = rsib.value_;
                rslt = handler(v);
                _save_to_cache(use_cache,that,matcher_pls,v);
                //
                let comnd = rsib.$rsib_;
                if(comnd === null) {
                    //[ matcher, handler]
                    rtrn_flag =true;       //默认 compleation break
                } else {
                    //[ matcher, handler,break]
                    rtrn_flag = comnd.value_;
                }
            } else {
                nd = rsib;
                return([use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag])
            }
        } else {
            //not match
        }
        ////弹出本次matcher路径
        //matcher_pls.pop()
        ////
        nd = _goto_next_switch(nd);
        ////
    } else if(is_dflt_case(nd)) {
        [that,matcher_pls,nd,v,rtrn_flag,rslt,dflt_handler] = 
            _mani_branch_dflt_case(use_cache,that,matcher_pls,v,nd,rtrn_flag,rslt,dflt_handler);
    } else if(is_completion(nd)) {
        rtrn_flag = nd.value_;
        nd = _goto_next_switch(nd);
    } else {
        //switch
        nd = nd.$sdfs_next_;
    }
    return([use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag])
}


////ASYNC

async function _aexec_dflt_case_handler(use_cache,that,matcher_pls,v,handler,dflt_handler) {
    handler = (handler === undefined)?dflt_handler:handler;
    let rslt;
    if(is_async_func(handler)) {
        rslt = await handler(v);
    } else {
        rslt = handler(v);
    }
    _save_to_cache(use_cache,that,matcher_pls,v);
    return(rslt)
}


async function _amani_branch_dflt_case(use_cache,that,matcher_pls,v,nd,rtrn_flag,rslt,dflt_handler) {
    //matcher_pls.push(nd);
    matcher_pls = nd;
    let fstch = nd.$fstch_;
    if(fstch === null) {
        //dflt-switch-entry 为空,默认handler返回原值,默认 compleation break
        rtrn_flag = true;
    } else {
        if(fstch.key_ === 'handler') {
            //如果fstch 是handler
            let handler = fstch.value_;
            rslt = await _aexec_dflt_case_handler(use_cache,that,matcher_pls,v,handler,dflt_handler);
            //
            let comnd = fstch.$rsib_;
            if(comnd === null) {
                rtrn_flag =true;       //默认completion 后return
            } else {
                rtrn_flag = comnd.value_;
            }
        } else {
            //如果fstch 是completion
            let comnd = fstch;
            let rsib = comnd.$rsib_;
            if(rsib === null) {
                //没有handler
            } else {
                //有handler
                let handler = rsib.value_;
                rslt = await _aexec_dflt_case_handler(use_cache,that,matcher_pls,v,handler,dflt_handler);
            }
            rtrn_flag  = comnd.value_;
        }
        ////弹出本次matcher路径
        //matcher_pls.pop()
        ////
        nd = _goto_next_switch(nd);
    }
    return([that,matcher_pls,v,nd,rtrn_flag,rslt,dflt_handler])
}



async function _anext(
    use_cache,
    dflt_handler,      // 兼容dflt-case-switch: {handler:undefined}
    that,v,rslt,nd,
    matcher_pls,
    rtrn_flag,
) {
    if(is_matcher(nd)) {
        //更新matcher 路径
        //matcher_pls.push(nd);
        matcher_pls = nd;
        ////
        let cond;
        if(is_async_func(nd.value_)) {
             cond = await nd.value_(v);
        } else {
             cond = nd.value_(v);
        }
        if(cond) {
            //matched
            let rsib = nd.$rsib_;
            if(rsib === null) {
                //switch-entry 只有 matcher,默认handler返回原值,默认 compleation break
                rtrn_flag =true;
            } else if(is_completion(rsib)) {
                //[ matcher,completion ]
                rtrn_flag = rsib.value_
            } else if(is_dflt_case(rsib)) {
                throw(`default case can NOT follow matcher`)
            } else if(is_handler(rsib)) {
                //[ matcher, handler,<...>]
                let handler = rsib.value_;
                if(is_async_func(handler)) {
                    rslt = await handler(v);
                } else {
                    rslt = handler(v);
                }
                _save_to_cache(use_cache,that,matcher_pls,v);
                //
                let comnd = rsib.$rsib_;
                if(comnd === null) {
                    //[ matcher, handler]
                    rtrn_flag =true;       //默认 compleation break
                } else {
                    //[ matcher, handler,break]
                    rtrn_flag = comnd.value_;
                }
            } else {
                nd = rsib;
                return([use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag])
            }
        } else {
            //not match
        }
        ////弹出本次matcher路径
        //matcher_pls.pop()
        ////
        nd = _goto_next_switch(nd);
        ////
    } else if(is_dflt_case(nd)) {
        [that,matcher_pls,nd,v,rtrn_flag,rslt,dflt_handler] = 
            await _amani_branch_dflt_case(use_cache,that,matcher_pls,v,nd,rtrn_flag,rslt,dflt_handler);
    } else if(is_completion(nd)) {
        rtrn_flag = nd.value_;
        nd = _goto_next_switch(nd);
    } else {
        //switch
        nd = nd.$sdfs_next_;
    }
    return([use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag])
}

function _handle(that,use_cache,dflt_handler,v) {
    let matcher_pls = []
    let nd = that.tree_.$fstch_;
    let rtrn_flag = false;
    let rslt;
    while(nd!==null && !rtrn_flag && nd!==that.tree_) {
        let arr = _next(
            use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag
        );
        [use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag] = arr;
    }
    return(rslt)
}

async function _ahandle(that,use_cache,dflt_handler,v) {
    let matcher_pls = []
    let nd = that.tree_.$fstch_;
    let rtrn_flag = false;
    let rslt;
    while(nd!==null && !rtrn_flag && nd!==that.tree_) {
        [use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag] = await _anext(
            use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag
        );
    }
    return(rslt)
}


function _add_main_handle(use_cache,dflt_handler,_Cls,mode) {
    let feng    = (mode===MODE.sync)?_handle:_ahandle;
    if(mode===MODE.sync) {
        add_method(_Cls,'_handle',function(v){return(feng(this,use_cache,dflt_handler,v))});
        add_method(_Cls,'handle', function(v){return(this._handle(v))});
        add_method(
            _Cls,'gen',
            function * (v) {
                let matcher_pls = []
                let nd = this.tree_.$fstch_;
                let rtrn_flag = false;
                let rslt;
                let that = this;
                while(nd!==null && !rtrn_flag && nd!==this.tree_) {
                    yield(nd);
                    [use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag] =  _next(
                        use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag
                    );
                }
                yield(rslt)
            }
        );
    } else {
        add_method(
            _Cls,'_handle',
            async function(v) {
                let r = await feng(this,use_cache,dflt_handler,v);
                return(r)
            }
        );
        add_method(
            _Cls,'handle',
            async function(v) {
                let r = await this._handle(v)
                return(r)
            }
        );
        add_method(
            _Cls,'gen',
            async function * (v) {
                let matcher_pls = []
                let nd = this.tree_.$fstch_;
                let rtrn_flag = false;
                let rslt;
                let that = this;
                while(nd!==null && !rtrn_flag && nd!==this.tree_) {
                    yield(nd);
                    [use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag] = await _anext(
                        use_cache,dflt_handler,that,v,rslt,nd,matcher_pls,rtrn_flag
                    );
                }
                yield(rslt)
            }
        );        
    }
}



module.exports = {
    is_dflt_case,
    is_matcher,
    DFLT_CASE_MATCHER_PLID,
    is_handler,
    is_completion,
    _handle,
    _ahandle,
    _add_main_handle,
}



