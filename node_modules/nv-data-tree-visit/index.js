const {FLAG_DICT} = require("nv-data-tree-actdef");

function _creat_more_less(nd) {
    let rt =nd;
    let curr = nd;
    let drmost = nd.$drmost_;
    let mjmp = false;
    let ljmp = false;
    function more(n=1) {
        ljmp = false;
        let cache = []
        while(cache.length<n) {
            if(mjmp) {
                curr = rt;
                mjmp = false;
            } else {
                curr = curr.$sdfs_next_;
                if(curr === null) {curr = rt}
            }
            if(curr === drmost) {mjmp = true}
            if(curr === rt) {ljmp = true}
            cache.push(curr);
        }
        return(cache)
    }
    function cursor() {return(curr)}
    function less(n=1) {
        mjmp = false;
        let cache = [];
        while(cache.length<n) {
            if(ljmp) {
                curr = drmost;
                ljmp = false;
            } else {
                curr = curr.$sdfs_prev_;
                if(curr === null) {curr = drmost}
            }
            if(curr === drmost) {mjmp = true}
            if(curr === rt) {ljmp = true}
            cache.unshift(curr);
        }
        return(cache)
    }
    return([more,cursor,less])
}

function add_more_less(Node) {
    Node.prototype.$more_less = function () {return(_creat_more_less(this))}
}

const DFLT_VISIT_FUNC = (nd,visitor)=>{}

const SYM_OPEN = Symbol("open");
const SYM_CLOSE = Symbol("close");

class Visitor {
    #action = 0;
    #val = undefined;
    #state
    get action_() {return(this.#action)}
    get val_()    {return(this.#val)}
    [SYM_OPEN]()  {this.#state =0}
    [SYM_CLOSE]() {this.#state =1}
    is_opened() {return(this.#state ===0)}
    is_closed() {return(this.#state ===1)}
    yield(){this.#action = 0}
    skip() {this.#action = 1}
    disconn() {this.#action = 2}
    add_lsib(nd) {this.#action = 3;this.#val =nd}
    add_rsib(nd) {this.#action = 4;this.#val =nd}
    add_child(nd) {this.#action = 5;this.#val =nd}
    replace_with(nd) {this.#action = 6;this.#val =nd}
    erase() {this.#action =7;this.#val=undefined}
    replace_tree(nd) {this.#action = 8;this.#val =nd}
    replace_node(nd) {this.#action = 9;this.#val =nd}
    reset(){this.#action = 0;this.#val=undefined}
}

const ALRM_DICT = {
    'add_child':'add-child-only-can-be-applied-on-leaf;for-nonleaf,using add_?sib on child',
    'replace':'use-replace-tree or replace-node; replace_with is a old API, have NO effect'
}

function _get_ndflag(nd,flag) {
    let [nnd,nflag] = nd.$sedfs_next(flag);
    flag = FLAG_DICT[nflag];
    return([nnd,flag])
}

function * gen(rt,f=DFLT_VISIT_FUNC) {
    const visitor = new Visitor();
    let [nd,flag] = _get_ndflag(rt,0);
    while(nd!==null) {
        if(flag === 0) {visitor[SYM_OPEN]();} else {visitor[SYM_CLOSE]();}
        f(nd,visitor);
        if(visitor.action_ === 0) {
            yield(nd);
            [nd,flag] = _get_ndflag(nd,flag);
        } else if(visitor.action_ ===1) {
            [nd,flag] = _get_ndflag(nd,flag);
        } else if(visitor.action_ ===2) {
            if(flag===0) {
                //如果在open阶段disconn, 那么后续子树将不再访问
                nd.$rm_children();
                ////不会yield
                let old_nd = nd;
                [nd,flag] = _get_ndflag(nd,flag);
                old_nd.$disconn();
            } else {
                //如果在close阶段disconn,说明子树已经访问完毕
                //先yield此node,然后disconn
                yield(nd);
                let old_nd = nd;
                [nd,flag] = _get_ndflag(nd,flag);
                old_nd.$disconn();
            }
        } else if(visitor.action_ ===3) {
            //为了避免无限递归,add_lsib 无论发生在哪个阶段
            //都不会去回退遍历新增lsib的子树
            let lsib = nd.$add_lsib(visitor.val_);
            /*if(flag ===0){yield * (lsib.$gen_sedfs_next(0));} else {}*/
            yield(nd);
            [nd,flag] = _get_ndflag(nd,flag);
        } else if(visitor.action_ ===4) {
            yield(nd);
            if(flag === 0) {
                //open 阶段增加rsib 会遍历新增加点
                nd.$add_rsib(visitor.val_);
                [nd,flag] = _get_ndflag(nd,flag);
            } else {
                //close 阶段增加rsib 不会遍历新增节点
                let old_nd = nd;
                [nd,flag] = _get_ndflag(nd,flag);
                old_nd.$add_rsib(visitor.val_);
            }
        } else if(visitor.action_ ===5) {
            yield(nd);
            if(!nd.$is_leaf()) {
                console.log(ALRM_DICT.add_child);
            } else {
                if(flag === 0) {
                    nd.$append_child(visitor.val_);
                    [nd,flag] = _get_ndflag(nd,flag);
                } else {
                    let old_nd = nd;
                    [nd,flag] = _get_ndflag(nd,flag);
                    old_nd.$append_child(visitor.val_);
                }
            }
        } else if(visitor.action_ ===6){
            if(!nd.$replace_with) {
                console.log(ALRM_DICT.replace)
            } else {
                if(flag===0) {
                    nd = nd.$replace_with(visitor.val_);
                    flag = 0;
                    yield(nd);
                } else {
                    yield(nd);
                    nd = nd.$replace_with(visitor.val_);
                    flag = 1;
                }
            }
        } else if(visitor.action_ ===7) {
            if(flag===0) {
                nd.$rm_children();
                let old_nd = nd;
                [nd,flag] = _get_ndflag(nd,flag);
                old_nd.$erase();
            } else {
                yield(nd);
                let old_nd = nd;
                [nd,flag] = _get_ndflag(nd,flag);
                old_nd.$erase();
            }
        } else if(visitor.action_ ===8) {
            if(flag===0) {
                nd = nd.$replace_tree(visitor.val_);
                flag = 0;
                yield(nd);
            } else {
                yield(nd);
                nd = nd.$replace_tree(visitor.val_);
                flag = 1;
            }
        } else if(visitor.action_ ===9) {
            if(flag===0) {
                nd = nd.$replace_node(visitor.val_);
                flag = 0;
                yield(nd);
            } else {
                yield(nd);
                nd = nd.$replace_node(visitor.val_);
                flag = 1;
            }
        } else {
            //impossible
        }
        visitor.reset();
    }
}


function visit(rt,f=DFLT_VISIT_FUNC) {
    for(let each of gen(rt,f)){}
}


function add_visit(Node) {
    Node.prototype.$gen_visit = function (f=DFLT_VISIT_FUNC) {
        return(gen(this,f))
    }
    Node.prototype.$visit = function (f=DFLT_VISIT_FUNC) {visit(this,f)}
}



const ACTION_DICT = {
    'is_opened':'visitor.is_opened()',
    'is_closed':'visitor.is_closed()',
    'skip':'visitor.skip()',
    'disconn':'visitor.disconn()',
    'add_lsib':'visitor.add_lsib(new_node||undefined)',
    'add_rsib':'visitor.add_rsib(new_node||undefined)',
    'add_child':'visitor.add_child(new_node||undefined)',
    'replace_with':'visitor.replace_with(new_node||undefined)',
    'erase':'visitor.erase()',
    'replace_tree':'visitor.replace_tree(new_tree||undefined)',
    'replace_node':'visitor.replace_node(new_node||undefined)',
}


function add_mlv(Node) {
    add_more_less(Node);
    add_visit(Node);
    Node.Visitor = {
        DFLT_VISIT_FUNC,
        ACTION_DICT,
        ALRM_DICT
    }
}

module.exports = {
    add_more_less,
    DFLT_VISIT_FUNC,
    ACTION_DICT,
    ALRM_DICT,
    gen,
    visit,
    add_visit,
    add_mlv
}

