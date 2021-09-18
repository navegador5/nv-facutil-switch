function creat_not_func(cond_func) {
    let f = function(r,i,...cond_other_func_params) {
        return(!cond_func(r,i,...cond_other_func_params))
    }
    return(f)
}


function *gen_from_fst(arr,cond_func,...other_params) {
    for(let i=0;i<arr.length;i++) {
        let cond = cond_func(arr[i],i,...other_params)
        if(cond) {
            yield(i)
        } else {
        }
    }
}

function *gen_from_lst(arr,cond_func,...other_params) {
    for(let i=arr.length -1;i>-1;i--) {
        let cond = cond_func(arr[i],i,...other_params)
        if(cond) {
            yield(i)
        } else {
        }
    }
}


function all(arr,cond_func,...other_params) {
    let g = gen_from_fst(arr,cond_func,...other_params)
    return(Array.from(g))
}

function all_not(arr,cond_func,...other_params) {
    cond_func = creat_not_func(cond_func)
    return(all(arr,cond_func,...other_params))
}


function which_engine(gf,which,arr,cond_func,...other_params) {
    let g = gf(arr,cond_func,...other_params)
    let c = 0
    for(let each of g) {
        if(c===which) {return(each)}
        c = c +1
    }
}

function which(arr,index,cond_func,...other_params) {
    return(which_engine(gen_from_fst,index,arr,cond_func,...other_params))
}

function which_from_lst(arr,index,cond_func,...other_params) {
    return(which_engine(gen_from_lst,index,arr,cond_func,...other_params))
}

function which_not(arr,index,cond_func,...other_params) {
    cond_func = creat_not_func(cond_func)
    return(which(arr,index,cond_func,...other_params))
}

function which_not_from_lst(arr,index,cond_func,...other_params) {
    cond_func = creat_not_func(cond_func)
    return(which_from_lst(arr,index,cond_func,...other_params))
}

function fst(arr,cond_func,...other_params) {
    return(which(arr,0,cond_func,...other_params))
}

function fst_not(arr,cond_func,...other_params) {
    return(which_not(arr,0,cond_func,...other_params))
}

function lst(arr,cond_func,...other_params) {
    return(which_from_lst(arr,0,cond_func,...other_params))
}

function lst_not(arr,cond_func,...other_params) {
    return(which_not_from_lst(arr,0,cond_func,...other_params))
}

function some_engine(gf,arr,whiches,cond_func,...other_params) {
    let narr = []
    let g = gf(arr,cond_func,...other_params)
    let c = 0
    for(let each of g) {
        if(whiches.includes(c)) {narr.push(each)}
        c = c + 1
    }
    return(narr)
}

function some(arr,whiches,cond_func,...other_params) {
    return(some_engine(gen_from_fst,arr,whiches,cond_func,...other_params))
}

function some_not(arr,whiches,cond_func,...other_params) {
    cond_func = creat_not_func(cond_func)
    return(some_engine(gen_from_fst,arr,whiches,cond_func,...other_params))
}


function some_from_lst(arr,whiches,cond_func,...other_params) {
    return(some_engine(gen_from_lst,arr,whiches,cond_func,...other_params))
}

function some_not_from_lst(arr,whiches,cond_func,...other_params) {
    cond_func = creat_not_func(cond_func)
    return(some_engine(gen_from_lst,arr,whiches,cond_func,...other_params))
}



module.exports = {
    fst,
    fst_not,
    lst,
    lst_not,
    which,
    which_not,
    which_from_lst,
    which_not_from_lst,
    some,
    some_not,
    some_from_lst,
    some_not_from_lst,    
    all,
    all_not
}
