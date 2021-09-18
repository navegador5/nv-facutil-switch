function _engine(arr,empty,arg,f,from,to) {
    let mp = new Map()
    let lngth = arr.length;
    from = from??0;
    to = to??lngth;
    let c = from;
    for(let i=from;i<to;i++) {
        let cond = f(arg,arr[i])
        if(cond) {
            arr[c] = arr[i];
            mp.set(i,c);
            c =c+1;
        }
    }
    for(let i=c;i<to;i++) {arr[i]=empty}
    return(mp)
}


function defrag(arr,empty=undefined,from=undefined,to=undefined) {return(_engine(arr,empty,empty,(empty,r)=>r!==empty,from,to))}

function defrag_with_st(arr,st,empty=undefined,from=undefined,to=undefined) {return(_engine(arr,empty,st,(st,r)=>!st.has(r),from,to))}


module.exports = {
    defrag,
    defrag_with_st,
}
