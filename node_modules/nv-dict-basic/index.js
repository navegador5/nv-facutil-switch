const ary_bsc   = require("nv-array-basic");
const {is_int,hole,noexist}  = require("nv-facutil-basic");


function rm_engine(d,cond_func,...keys) {
    let ks = Object.keys(d);
    for(let k of ks){
        let cond = cond_func(keys,k)
        if(cond) {
            delete d[k]
        } else {
        }
    }
    return(d)    
}


function clear(d) {
    let keys = Object.keys(d);
    let cond_func = function(keys,k) {return(true)}
    return(rm_engine(d,cond_func,...keys));
}

function rm(d,...keys) {
    let cond_func = function(keys,k) {
        return(keys.includes(k))
    }
    return(rm_engine(d,cond_func,...keys));
}


function rm_not(d,...keys) {
    let cond_func = function(keys,k) {
        return(!keys.includes(k))
    }
    return(rm_engine(d,cond_func,...keys));
}





function kvlist(d) {
    let entries = Object.entries(d)
    let kl = entries.map(r=>r[0]);
    let vl = entries.map(r=>r[1]);
    return([kl,vl])
}

function from_kvlist(kl,vl) {
    let entries = kl.map((k,i)=>[k,vl[i]])
    return(Object.fromEntries(entries))
}


function klist_engine(d,cond_func,...keys) {
    let kl = Object.keys(d);
    if(keys.length === 0) {
        keys =  kl;
    }
    kl = kl.filter(k=>cond_func(keys,k));
    return(kl);
}

function klist(d,...keys) {
    let cond_func = function(keys,k) {
        return(keys.includes(k))
    }
    return(klist_engine(d,cond_func,...keys))
}


function klist_not(d,...keys) {
    let cond_func = function(keys,k) {
        return(!keys.includes(k))
    }
    return(klist_engine(d,cond_func,...keys))
}



function vlist_engine(d,cond_func,...keys) {
    if(keys.length === 0) {
        keys =  Object.keys(d);
    }
    let entries = Object.entries(d)
    entries = entries.filter(r=>cond_func(keys,r[0]));
    let vl = entries.map(r=>r[1]);
    return(vl);
}


function vlist(d,...keys) {
    let cond_func = function(keys,k) {
        return(keys.includes(k))
    }
    return(vlist_engine(d,cond_func,...keys));
}

function vlist_not(d,...keys) {
    let cond_func = function(keys,k) {
        return(!keys.includes(k))
    }
    return(vlist_engine(d,cond_func,...keys));
}

function some_engine(d,cond_func,...keys) {
    let nd = {}
    let ks = Object.keys(d);
    for(let i=0;i<ks.length;i++) {
        let k = ks[i];
        let cond = cond_func(keys,k);
        if(cond){
            nd[k] = d[k]
        }
    }
    return(nd)
}


function some(d,...keys) {
    let cond_func = function(keys,k) {
        return(keys.includes(k))
    }
    return(some_engine(d,cond_func,...keys));
}

function some_not(d,...keys) {
    let cond_func = function(keys,k) {
        return(!keys.includes(k))
    }
    return(some_engine(d,cond_func,...keys));
}



function update(d0,d1) {
    Object.assign(d0,d1);
    return(d0);
}


function update_engine(cond_func,d0,d1) {
    let ks0 = Object.keys(d0);
    let ks1 = Object.keys(d1);
    for(let i=0;i<ks1.length;i++) {
        let k = ks1[i];
        let cond = cond_func(ks0,k);
        if(cond){
            d0[k] = d1[k]
        }
    }
    return(d0)
}

function update_only_exist_in_own(d0,d1) {
    let cond_func = function(ks,k) {
        return(ks.includes(k))
    }
    return(update_engine(cond_func,d0,d1))
}


function update_only_non_exist_in_own(d0,d1) {
    let cond_func = function(ks,k) {
        return(!ks.includes(k))
    }
    return(update_engine(cond_func,d0,d1))
}


function length(d) {
    let ks = Object.keys(d);
    return(ks.length);
}


function eq(d0,d1) {
    let ks0 = Object.keys(d0);
    let ks1 = Object.keys(d1);
    ks0.sort();
    ks1.sort();
    let cond = (JSON.stringify(ks0) === JSON.stringify(ks1))
    if(cond) {
        for(let i=0;i<ks0.length;i++) {
            if(d0[ks0[i]] === d1[ks1[i]]){} else {return(false)}
        }
        return(true)
    } else {
        return(false)
    }
}

////

function cp(d){
    let nd = {};
    Object.assign(nd,d);
    return(nd);
}


function to_map(d) {
    let mp = new Map();
    for(let k in d) {
        mp.set(k,d[k])
    }
    return(mp);
}


function to_wmap(d) {
    let wmp = new WeakMap();
    for(let k in d) {   
        wmp.set(d[k],k)
    }
    return(wmp)
}


function kincludes(d,k){return(Object.keys(d).includes(k))}
function vincludes(d,v){return(Object.values(d).includes(v))}
function kvincludes(d,k,v) {
    let entries = Object.entries(d)
    for(let e of entries) {
        if(e[0]===k && e[1]===v) {return(true)}
    }
    return(false)
}

function kvi_includes(d,k,v,i) {
    let entries = Object.entries(d)
    let e = entries[i]
    if(e[0]===k && e[1]===v) {return(true)}
    return(false)    
}

////

function *gen_from_fst(d) {
    let entries = Object.entries(d);
    for(let i=0;i<entries.length;i++) {
        yield({k:entries[i][0],v:entries[i][1],i:i})
    }
}

function *gen_from_lst(d) {
    let entries = Object.entries(d);
    for(let i=entries.length-1;i>-1;i--) {
        yield({k:entries[i][0],v:entries[i][1],i:i})
    }
}


function _re_engine(ks,vs) {
    let vlngth = vs.length;
    let klngth = ks.length;
    if(klngth<=vlngth) {
        vs = vs.slice(0,klngth)
    } else {
        ks = ks.slice(0,vlngth)
    }
    let entries = ks.map((k,i)=>[k,vs[i]])
    return(Object.fromEntries(entries))
}


function rekey(d,...ks) {
    let vs = Object.values(d);
    return(_re_engine(ks,vs))
}

function reval(d,...vs) {
    let ks = Object.keys(d);
    return(_re_engine(ks,vs))
}


function krekey(d,ok,nk) {
    if(d.hasOwnProperty(ok)) {
       let v = d[ok];
       delete d[ok];
       d[nk] = v
    } else {
    }
    return(d)
}

function vrekey(d,v,nk) {
    for(let ok in d) {
        if(d[ok]===v) {
            delete d[ok];
            d[nk] =v;
            break
        }
    }
    return(d)
}

function getset(d,k,v) {
    if(d.hasOwnProperty(k)) {
        d[k] =v
    } else{
        d[k] = undefined
    }
    return(d)
}

function setnx(d,k,v) {
    if(!d.hasOwnProperty(ok)) {
        d[k] =v
    } else{}
    return(d)
}

function mset(d,...kvs) {
    for(let i =0;i<kvs.length;i=i+2) {
        d[kvs[i]] = kvs[i+1]
    }
    return(d)
}

function msetnx(d,...kvs) {
    let cond =true;
    for(let i =0;i<kvs.length;i=i+2) {
       if(d.hasOwnProperty(kvs[i])) {
           cond = false;
           break;
       }
    }
    if(cond) {mset(d,...kvs)}
    return(d)
}


////
function concat(...ds) {
    let d = {}
    ds.forEach(r=>Object.assign(d,r));
    return(d)
}

function assign(d,...ds) {
    ds.forEach(r=>Object.assign(d,r));
    return(d)
}

////
function keyat(d,index) {
    let ks = Object.keys(d);
    return(ks[index])
}

function idxat(d,k) {
    let ks = Object.keys(d);
    return(ks.indexOf(k))
}

function fstk(d) {
    let ks = Object.keys(d);
    return(ks[0])
}

function lstk(d) {
    let ks = Object.keys(d);
    return(ks[ks.length-1])
}

function iget(d,index) {
    return(d[keyat(d,index)])
}

function iset(d,index,val) {
    let k = keyat(d,index)
    if(k in d) {d[k]=val} else {}
    return(d)
}

function idel(d,index) {
    let k = keyat(d,index)
    if(k in d) {delete d[k]} else {}
    return(d)
} 

function ihas(d,index) {
    let k = keyat(d,index);
    return(k in d)
}

////
function islice(d,si,ei) {
    let ks = Object.keys(d);
    let vs = Object.values(d);
    si = ary_bsc.uniform_index(ks,si);
    ei = (ei===undefined)?ks.length:ary_bsc.uniform_index(ks,ei);
    let nd = {}
    for(let i=si;i<ei;i++) {nd[ks[i]]=d[ks[i]]}
    return(nd)
}


function kslice(d,sk,ek) {
    let ks = Object.keys(d);
    let vs = Object.values(d);
    let si = ks.indexOf(sk);
    let ei = (ek===undefined)?ks.length:ks.indexOf(ek);
    let nd = {}
    if(si>=0 && ei>=0) {
        for(let i=si;i<ei;i++) {nd[ks[i]]=d[ks[i]]}
    }
    return(nd)
}

function _iork_to_i(ks,iork) {
    if(iork === undefined) {
        return(ks.length)
    } else if(is_int(iork)) {
        return(ary_bsc.uniform_index(ks,iork))
    } else {
        return(ks.indexOf(iork))
    }
}

function slice(mp,ik0,ik1) {
    let ks = Object.keys(d);
    let vs = Object.values(d);
    let si = _iork_to_i(ks,ik0);
    let ei = _iork_to_i(ks,ik1);
    let nd = {}
    if(si>=0 && ei>=0) {
        for(let i=si;i<ei;i++) {nd[ks[i]]=d[ks[i]]}
    }
    return(nd)
}

////
function list(d) {return(Object.entries(d).flat())}
function from_list(l) {
    let d = {}
    for(let i=0;i<l.length-1;i=i+2) {d[l[i]] = l[i+1]}
    return(d)
}
////

function clear_and_tokvlist(d) {
    let oks = []
    let ovs = []
    for(let k in d) {
        oks.push(k);
        ovs.push(d[k]);
        delete d[k]
    }
    return([oks,ovs])
}

function clear_and_cp(d) {
    let nd ={}
    for(let k in d) {
        nd[k] = d[k]
        delete d[k]
    }
    return(nd)
}

function clear_and_tolist(d) {
    let l = []
    for(let k in d) {
        l.push(k,d[k])
        delete d[k]
    }
    return(l)
}



function pop_before(d,iork) {
    let ks = Object.keys(d);
    let ei = _iork_to_i(ks,iork);
    let nd = {}
    if(ei<=0 || ei>=ks.length) {
    } else {
        for(let i=0;i<ei;i++) {
            nd[ks[i]] = d[ks[i]]
            delete d[ks[i]]
        }
    }
    return(nd)
}

function pop_from(d,iork) {
    let ks = Object.keys(d);
    let si = _iork_to_i(ks,iork);
    let nd = {}
    if(si<=0 || si>=ks.length) {
    } else {
        for(let i=si;i<ks.length;i++) {
            nd[ks[i]] = d[ks[i]]
            delete d[ks[i]]
        }
    }
    return(nd)
}


function pop_after(d,iork) {
    let ks = Object.keys(d);
    let si = _iork_to_i(ks,iork);
    let nd = {}
    if(si<=0 || si>=ks.length) {
    } else {
        for(let i=si+1;i<ks.length;i++) {
            nd[ks[i]] = d[ks[i]]
            delete d[ks[i]]
        }
    }
    return(nd)
}

function pop_between(d,iork0,iork1) {
    let ks = Object.keys(d);
    let si = _iork_to_i(ks,iork0);
    let ei = _iork_to_i(ks,iork1);
    let nd = {}
    if(si<=0 || ei<=0) {
    } else {
        for(let i=si;i<ei;i++) {
            nd[ks[i]] = d[ks[i]]
            delete d[ks[i]]
        }
    }
    return(nd)
}

function rm_before(d,iork) {pop_before(d,iork);return(d)}
function rm_after(d,iork) {pop_after(d,iork);return(d)}
function rm_between(d,iork0,iork1) {pop_between(d,iork0,iork1);return(d)}
function rm_from(d,iork) {pop_from(d,iork);return(d)}


function push(d,nd) {for(let k in nd) {d[k] = nd[k]};return(d)}

function unshift(d,nd) {
    let old = clear_and_cp(d)    
    push(d,nd);
    push(d,old);
    return(d)
}

function pop(d,n=1,iork) {
    let ks = Object.keys(d);
    let si;
    if(iork === undefined) {si=ks.length-1} else {si=_iork_to_i(ks,iork);}
    let ei = Math.min(ks.length,si+n);
    let nd = {}
    for(let i=si;i<ei;i++) {
        nd[ks[i]] = d[ks[i]]
        delete d[ks[i]]
    }
    return(nd)
}

function shift(d,n=1) {return(pop(d,n,0))}

function insert_before(d,iork,nd) {
    let ks = Object.keys(d);
    let ei = _iork_to_i(ks,iork);  
    if(ei<=0 || ei>=ks.length) {
        return(d)
    } else {
        let after = pop_after(d,ei-1);
        push(d,nd);
        push(d,after);
        return(d)
    }
}

function insert_after(d,iork,nd) {
    let ks = Object.keys(d);
    let si = _iork_to_i(ks,iork);
    si = si+1;
    if(si<=0 || si>ks.length) {
        return(d)
    } else if(si === ks.length) {
        push(d,nd);
        return(d)
    } else{
        let after = pop_after(d,si);
        push(d,nd);
        push(d,after);
        return(d)
    }
}


function safe_get(d,key) {
    if(d.hasOwnProperty(key)) {
        return(d[key])
    } else {
        return(noexist)
    }
}

const ERROR_DICT = {
    key_not_exist:new Error("key_not_exist")
}

function safe_set(d,key,value) {
    if(d.hasOwnProperty(key)) {
        d[key] = value
    } else {
        throw(ERROR_DICT.key_not_exist)
    }
}



module.exports = {
    ////
    keyat,
    idxat,
    fstk,
    lstk,
    iget,
    iset,
    idel,
    ihas,
    ////
    concat,
    assign,
    ////
    islice,
    kslice,
    slice,
    ////
    push,
    unshift,
    pop,
    pop_before,
    pop_after,
    pop_between,
    pop_from,
    shift,
    insert_before,
    insert_after,
    ////
    clear,
    clear_and_tokvlist,
    clear_and_cp,
    clear_and_tolist,
    ////
    rm,
    rm_not,
    rm_before,
    rm_after,
    rm_between,
    rm_from,
    ////
    list,
    from_list,
    ////
    kvlist,
    from_kvlist,
    ////
    klist,
    klist_not,
    ////
    vlist,
    vlist_not,
    ////
    some,
    some_not,
    ////
    update,
    update_only_exist_in_own,
    update_only_non_exist_in_own,
    ////
    length,
    eq,
    ////
    kincludes,
    vincludes,
    kvincludes,
    kvi_includes,
    ////
    cp,
    to_map,
    to_wmap,
    ////
    gen_from_fst,
    gen_from_lst,
    ////
    rekey,
    reval,
    ////
    krekey,
    vrekey,
    getset,
    setnx,
    mset,
    msetnx,
    ////
    noexist,
    ERROR_DICT,
    safe_get,
    safe_set,
}
