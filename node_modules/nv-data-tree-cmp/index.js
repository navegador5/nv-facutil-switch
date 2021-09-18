function creat_ele_mat(nd,f=(nd,nnd)=>{}) {
    let nnd = nd.$clone(f)
    var m = nnd.$lyrs_
    for(let i= m.length-1;i>-1;i--) {
        let lyr = m[i];
        for(let j=0;j<lyr.length;j++) {
            let nd = lyr[j];
            Object.assign(nd,{
                height:m.length-i,
                children_count:0,
                length:1
            })
        }
    }
    for(let i= m.length-1;i>0;i--) {
        let lyr = m[i];
        for(let j=0;j<lyr.length;j++) {
            let nd = lyr[j];
            let pnd = nd.$parent_;
            pnd.children_count = pnd.children_count +1;
            pnd.length = pnd.length + nd.length;
        }
    }
    return(m)
}

function _sort_children(children,sort_func=(a,b)=>0) {
    children.sort((a,b)=>{
        let rslt = a.length - b.length;
        rslt = (rslt===0)?a.height-b.height:rslt;
        rslt = (rslt===0)?a.children_count-b.children_count:rslt;
        rslt = (rslt===0)?sort_func(a,b):rslt;
        return(rslt)
    })
    return(children)
}

function _sort_nd(nd,sort_func=(a,b)=>0) {
    let children = nd.$rm_children()
    _sort_children(children,sort_func);
    nd.$append_children(children)
}

function dcp_and_sort_nd(nd,sort_func=(a,b)=>0) {
    let m = creat_ele_mat(nd)
    for(let i= 0;i<m.length-1;i++) {
        let lyr = m[i];
        for(let j=0;j<lyr.length;j++) {
            let nnd = lyr[j];
            _sort_nd(nnd,sort_func)
        }
    }
    return(m[0][0])
}

function strict_eq(nd0,nd1,cmp_func=(a,b)=>true) {
    let g0 = nd0.$gen_sdfs_next_srch_action()
    let g1 = nd1.$gen_sdfs_next_srch_action()
    let curr0=nd0;
    let curr1=nd1;
    for(let act0 of g0) {
        let act1 = g1.next().value;
        if(act1 === undefined) {
            return(false)
        } else {
            if(act0.k !== act1.k) {
                return(false)
            } else {
                curr0=curr0[act0.k];
                curr1=curr1[act1.k];
                if(cmp_func(curr0,curr1)){
                } else {
                    return(false)
                }
            }
        }
    }
    if(g1.next().value!==undefined) {
        return(false)
    } else {
        return(true)
    }
}

function loose_eq(nd0,nd1,sort_func=(a,b)=>0,cmp_func=(a,b)=>true) {
    let nnd0 = dcp_and_sort_nd(nd0,sort_func)
    let nnd1 = dcp_and_sort_nd(nd1,sort_func)
    let rslt = strict_eq(nnd0,nnd1,cmp_func);
    nnd0.$erase_r();
    nnd1.$erase_r();
    return(rslt)
}

function add_deep_steq(Node) {
    Node.prototype.$deep_steq = function(nd,cmp_func=(a,b)=>true) {
        return(strict_eq(this,nd,cmp_func))
    }
}

function add_deep_lseq(Node) {
    Node.prototype.$deep_lseq = function(nd,sort_func=(a,b)=>0,cmp_func=(a,b)=>true) {
        return(loose_eq(this,nd,sort_func,cmp_func))
    }
}


module.exports = {
    creat_ele_mat,
    dcp_and_sort_nd,
    strict_eq,
    loose_eq,
    add_deep_steq,
    add_deep_lseq,
}

