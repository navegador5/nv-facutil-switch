nv-array-find-index
===============
- nv-array-find-index 


install
=======
- npm install nv-array-find-index 

usage
=====
    
example
-------
    const ary_findi = require("nv-array-find-index")
    
    var arr = [1,2,3,4,5]
    var narr = ary_findi.all(arr,r=>r%2)
    //[0,2,4]
    
    var narr = ary_findi.all_not(arr,r=>r%2)
    //[ 1, 3 ]

    ary_findi.which(arr,1,r=>r%2)
    //2
    ary_findi.which(arr,5,r=>r%2)
    //undefined
    ary_findi.which_not(arr,1,r=>r%2)
    //3
    
    ary_findi.which_from_lst(arr,1,r=>r%2)
    //2    5->4->3
    
    ary_findi.fst(arr,r=>r%2)
    //0
    ary_findi.fst_not(arr,r=>r%2)
    //1
    ary_findi.lst(arr,r=>r%2)
    //4
    ary_findi.lst_not(arr,r=>r%2)
    //3
    
    ary_findi.some(arr,[0,2],r=>r%2)
    //[0,4]
    ary_findi.some_not(arr,[0,2],r=>r%2)
    //[ 1 ]
    ary_findi.some_not(arr,[0,1],r=>r%2)
    //[ 1, 3 ]
    ary_findi.some_from_lst(arr,[0,2],r=>r%2)
    //[4,0]
    ary_findi.some_not_from_lst(arr,[0,2],r=>r%2)
    //[3]
    ary_findi.some_not_from_lst(arr,[0,1],r=>r%2)
    //[ 3, 1 ]

API
====

- ary\_findi.fst(arr,cond\_func,...other\_params)
- ary\_findi.fst\_not(arr,cond\_func,...other\_params)
- ary\_findi.lst(arr,cond\_func,...other\_params)
- ary\_findi.fst\_not(arr,cond\_func,...other\_params)
- ary\_findi.which(arr,which,cond\_func,...other\_params)
- ary\_findi.which\_not(arr,which,cond\_func,...other\_params)
- ary\_findi.which\_from\_lst(arr,which,cond\_func,...other\_params)
- ary\_findi.which\_not\_from\_lst(arr,which,cond\_func,...other\_params)
- ary\_findi.some(arr,whiches,cond\_func,...other\_params)
- ary\_findi.some\_not(arr,whiches,cond\_func,...other\_params)
- ary\_findi.some\_from\_lst(arr,whiches,cond\_func,...other\_params)
- ary\_findi.some\_not\_from\_lst(arr,whiches,cond\_func,...other\_params)
- ary\_findi.all(arr,cond\_func,...other\_params)
- ary\_findi.all\_not(arr,cond\_func,...other\_params)



LICENSE
=======
- ISC 
