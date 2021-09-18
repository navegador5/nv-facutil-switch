nv-dict-basic
============
- nv-dict-basic


install
=======
- npm install nv-dict-basic

usage
=====

example
-------

    const dict_bsc = require("nv-dict-basic")


        //dict_bsc.some
        > var d = {a:100,b:200,c:300}
        undefined
        > dict_bsc.some(d,'a','c')
        { a: 100, c: 300 }
        > d
        { a: 100, b: 200, c: 300 }
        >



        //dict_bsc.some_not
        > var d = {a:100,b:200,c:300}
        undefined
        > dict_bsc.some_not(d,'a','c')
        {b: 200}
        > d
        { a: 100, b: 200, c: 300 }
        >

        //dict_bsc.length
        var d = {a:100,b:200,c:300}
        > dict_bsc.length(d)
        3
        >

        //kvlist
        var d = {a:100,b:200,c:300}
        var [kl,vl] = dict_bsc.kvlist(d)
        > kl
        [ 'a', 'b', 'c' ]
        > vl
        [ 100, 200, 300 ]
        >
        dict_bsc.from_kvlist(kl,vl)
        { a: 100, b: 200, c: 300 }

        //vlist
        var d = {a:100,b:200,c:300}
        > dict_bsc.vlist(d,'a','c')
        [ 100, 300 ]
        >
        > dict_bsc.vlist_not(d,'a','c')
        [ 200 ]
        >


        //dict_bsc.update

        var d0 = {a:1,b:2,c:3,d:4}
        var d1 = {b:200,e:500}
        > dict_bsc.update(d0,d1)
        { a: 1, b: 200, c: 3, d: 4, e: 500 }
        >
        > d0
        { a: 1, b: 200, c: 3, d: 4, e: 500 }
        >


        var d0 = {a:1,b:2,c:3,d:4}
        var d1 = {b:200,e:500}
        dict_bsc.update_only_exist_in_own(d0,d1)
        { a: 1, b: 200, c: 3, d: 4 }


        var d0 = {a:1,b:2,c:3,d:4}
        var d1 = {b:200,e:500}
        dict_bsc.update_only_non_exist_in_own(d0,d1)
        { a: 1, b: 2, c: 3, d: 4, e: 500 }



        //dict_bsc.clear
        > var d = {a:100,b:200,c:300}
        undefined
        > dict_bsc.clear(d)
        {}
        > d
        {}
        >

        //dict_bsc.rm
        > var d = {a:100,b:200,c:300}
        undefined
        > dict_bsc.rm(d,'a','c')
        { b: 200 }
        > d
        { b: 200 }
        >


        //dict_bsc.rm_not
        > var d = {a:100,b:200,c:300}
        undefined
        > dict_bsc.rm_not(d,'a','c')
        { a: 100, c: 300 }
        > d
        { a: 100, c: 300 }
        >


    const {gen_from_fst,gen_from_lst} = require("nv-dict-basic");
    var d = {a:100,b:200,c:300}
    var g = gen_from_fst(d)
    > g.next()
    { value: { k: 'a', v: 100, i: 0 }, done: false }
    > g.next()
    { value: { k: 'b', v: 200, i: 1 }, done: false }
    > g.next()
    { value: { k: 'c', v: 300, i: 2 }, done: false }
    > g.next()
    { value: undefined, done: true }
    >
    var g = gen_from_lst(d)
    > g.next()
    { value: { k: 'c', v: 300, i: 2 }, done: false }
    > g.next()
    { value: { k: 'b', v: 200, i: 1 }, done: false }
    > g.next()
    { value: { k: 'a', v: 100, i: 0 }, done: false }
    > g.next()
    { value: undefined, done: true }
    >

    var d = {a:100,b:200,c:100,d:200,e:300}
    > dict_bsc.rekey(d,'A','B','C','D','E')
    { A: 100, B: 200, C: 100, D: 200, E: 300 }
    >
    > dict_bsc.reval(d,1,2,3,4,5)
    { a: 1, b: 2, c: 3, d: 4, e: 5 }
    >


    > var d = {a:100,b:200}
    > dict_bsc.krekey(d,'b','B')
    { a: 100, B: 200 }
    >
    > d
    { a: 100, B: 200 }
    >
    
    > var d = {a:100,b:200}
    > dict_bsc.vrekey(d,200,'B')
    { a: 100, B: 200 }
    > d
    { a: 100, B: 200 }
    >
    
    
    > var d = {a:100,b:200}
    > dict_bsc.getset(d,'a',999)
    { a: 999, b: 200 }
    > d
    { a: 999, b: 200 }
    >
    > dict_bsc.getset(d,'noex',999)
    { a: 999, b: 200, noex: undefined }
    >
    >
    
    > var d = {}
    > dict_bsc.mset(d,'a',100,'b',200)
    { a: 100, b: 200 }
    > d
    { a: 100, b: 200 }
    >
    
    > var d = {a:100,b:200}
    > dict_bsc.msetnx(d,'a',999,'b',333)
    { a: 100, b: 200 }
    > d
    { a: 100, b: 200 }
    > dict_bsc.msetnx(d,'c',999,'d',333)
    { a: 100, b: 200, c: 999, d: 333 }
    > d
    { a: 100, b: 200, c: 999, d: 333 }
    >

assign
------

    > dict_bsc.assign(d0,d1,d2)
    { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    >
    > d0                                                    //inplace
    { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    
    > d1
    { c: 10, d: 20 }
    > d2
    { e: 100, f: 200 }
    >

concat
------


    var d0 = {'a':1,'b':2}
    var d1 = {'c':10,'d':20}
    var d2 = {'e':100,'f':200}
    
    > var nd012 = dict_bsc.concat(d0,d1,d2)
    
    > nd012                                           //a new dict
    { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    > d0
    { a: 1, b: 2 }
    > d1
    { c: 10, d: 20 }
    > d2
    { e: 100, f: 200 }
    >

    > nd102
    { c: 10, d: 20, a: 1, b: 2, e: 100, f: 200 }
    > d0
    { a: 1, b: 2 }
    > d1
    { c: 10, d: 20 }
    > d2
    { e: 100, f: 200 }
    >


index oper
----------

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }

    > dict_bsc.keyat(d,2)
    'c'
    >
    > dict_bsc.idxat(d,'c')
    2
    > dict_bsc.fstk(d)
    'a'
    > dict_bsc.lstk(d)
    'f'
    >
    > dict_bsc.iget(d,2)
    10
    > dict_bsc.iset(d,2,'CCCC')
    { a: 1, b: 2, c: 'CCCC', d: 20, e: 100, f: 200 }
    >
    > dict_bsc.ihas(d,2)
    true
    > dict_bsc.ihas(d,5)
    true
    > dict_bsc.ihas(d,8)
    false
    >
    > dict_bsc.idel(d,2)
    { a: 1, b: 2, d: 20, e: 100, f: 200 }
    >

list
----

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > var l = dict_bsc.list(d)
    [
      'a', 1,   'b', 2,   'c',
      10,  'd', 20,  'e', 100,
      'f', 200
    ]
    >
    > dict_bsc.from_list(l)
    { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    >

    */

clear
-----

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    
    /*
    > dict_bsc.clear(d)
    {}
    > d
    {}
    >
    */
    
    
    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > var nd = dict_bsc.clear_and_cp(d)
    undefined
    > d
    {}
    > nd
    { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    >
    */
    
    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > var [kl,vl] = dict_bsc.clear_and_tokvlist(d)
    undefined
    > d
    {}
    > kl
    [ 'a', 'b', 'c', 'd', 'e', 'f' ]
    > vl
    [ 1, 2, 10, 20, 100, 200 ]
    >
    */
    
    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > var l = dict_bsc.clear_and_tolist(d)
    undefined
    > l
    [
      'a', 1,   'b', 2,   'c',
      10,  'd', 20,  'e', 100,
      'f', 200
    ]
    > d
    {}
    >
    
    */

remove
------

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }

    /*
    > dict_bsc.rm_after(d,'b')
    { a: 1, b: 2 }
    > d
    { a: 1, b: 2 }
    >
    */

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > dict_bsc.rm_after(d,1)
    { a: 1, b: 2 }
    > d
    { a: 1, b: 2 }
    >
    */

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > dict_bsc.rm_before(d,'b')
    { b: 2, c: 10, d: 20, e: 100, f: 200 }
    >
    */

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    /*
    > dict_bsc.rm_before(d,3)
    { d: 20, e: 100, f: 200 }
    > d
    { d: 20, e: 100, f: 200 }
    >
    */

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    > dict_bsc.rm_after(d,3)
    { a: 1, b: 2, c: 10, d: 20 }
    >
    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    > dict_bsc.rm_from(d,3)
    { a: 1, b: 2, c: 10 }
    > d
    { a: 1, b: 2, c: 10 }
    >

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    >
    >
    > dict_bsc.rm_between(d,2,4)
    { a: 1, b: 2, e: 100, f: 200 }
    >
    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    > dict_bsc.rm_between(d,'c','e')
    { a: 1, b: 2, e: 100, f: 200 }
    >
    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    > dict_bsc.rm_between(d,2,'e')
    { a: 1, b: 2, e: 100, f: 200 }
    >
    > d
    { a: 1, b: 2, e: 100, f: 200 }
    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    > dict_bsc.rm_between(d,'c',4)
    { a: 1, b: 2, e: 100, f: 200 }
    >
    > d
    { a: 1, b: 2, e: 100, f: 200 }
    >

pop
----

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }

    var popped = dict_bsc.pop(d)
    /*
    > var popped = dict_bsc.pop(d)
    undefined
    > popped
    { f: 200 }
    > d
    { a: 1, b: 2, c: 10, d: 20, e: 100 }
    >
    */

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    var popped = dict_bsc.pop(d,2,'b')
    > popped
    { b: 2, c: 10 }
    >
    > d
    { a: 1, d: 20, e: 100, f: 200 }
    >

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    > dict_bsc.pop_before(d,'c')
    { a: 1, b: 2 }
    > d
    { c: 10, d: 20, e: 100, f: 200 }
    >

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    >
    >
    > dict_bsc.pop_before(d,2)
    { a: 1, b: 2 }
    > d
    { c: 10, d: 20, e: 100, f: 200 }
    >

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    >
    > dict_bsc.pop_after(d,'c')
    { d: 20, e: 100, f: 200 }
    >
    > d
    { a: 1, b: 2, c: 10 }
    >

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    >
    > dict_bsc.pop_from(d,'c')
    { c: 10, d: 20, e: 100, f: 200 }
    >
    > d
    { a: 1, b: 2 }
    >

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    >
    > dict_bsc.pop_between(d,'c','e')
    { c: 10, d: 20 }
    > d
    { a: 1, b: 2, e: 100, f: 200 }
    >

insert
-------

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    dict_bsc.insert_after(d,'c',{A:'AAA',B:'BBB'})

    > dict_bsc.insert_after(d,'c',{A:'AAA',B:'BBB'})
    { a: 1, b: 2, c: 10, d: 20, A: 'AAA', B: 'BBB', e: 100, f: 200 }
    > d
    { a: 1, b: 2, c: 10, d: 20, A: 'AAA', B: 'BBB', e: 100, f: 200 }
    >

    var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    dict_bsc.insert_before(d,'c',{A:'AAA',B:'BBB'})

    > var d = { a: 1, b: 2, c: 10, d: 20, e: 100, f: 200 }
    undefined
    >     dict_bsc.insert_before(d,'c',{A:'AAA',B:'BBB'})
    { a: 1, b: 2, A: 'AAA', B: 'BBB', c: 10, d: 20, e: 100, f: 200 }
    >

API
====

- dict\_bsc.list(d)
- dict\_bsc.from\_list(l)

- dict\_bsc.keyat(d,index)
- dict\_bsc.idxat(d,key)
- dict\_bsc.fstk(d)
- dict\_bsc.lstk(d)

- dict\_bsc.iget(d,index)
- dict\_bsc.iset(d,index,val)
- dict\_bsc.idel(d,index)
- dict\_bsc.ihas(d,index)

- dict\_bsc.assign(orig\_dict,...dicts)
- dict\_bsc.concat(...dicts)

- dict\_bsc.clear(d)
- dict\_bsc.clear\_and\_tolist(d)
- dict\_bsc.clear\_and\_toklist(d)
- dict\_bsc.clear\_and\_cp(d)

- dict\_bsc.rm(d,...keys)
- dict\_bsc.rm\_not(d,...keys)
- dict\_bsc.rm\_before(d,end\_key\_or\_index)
- dict\_bsc.rm\_after(d,key\_or\_index)        //not-included 
- dict\_bsc.rm\_from(d,key\_or\_index)         //included  
- dict\_bsc.rm\_between(d,start\_key\_or\_index,end\_key\_or\_index)


- dict\_bsc.pop(d,count=1,from\_index)
- dict\_bsc.pop\_before(d,end\_key\_or\_index)
- dict\_bsc.pop\_after(d,key\_or\_index)        //not-included
- dict\_bsc.pop\_from(d,key\_or\_index)         //included
- dict\_bsc.pop\_between(d,start\_key\_or\_index,end\_key\_or\_index)

- dict\_bsc.insert\_before(d,_key\_or\_index,nd)
- dict\_bsc.insert\_after(d,_key\_or\_index,nd)


- dict\_bsc.kvlist(d)
- dict\_bsc.from\_kvlist(kl,vl)
- dict\_bsc.klist(d,...keys)
- dict\_bsc.klist\_not(d,...keys)
- dict\_bsc.vlist(d,...keys)
- dict\_bsc.vlist\_not(d,...keys)

- dict\_bsc.some(d,...keys)
- dict\_bsc.some\_not(d,...keys)
- dict\_bsc.update(d0,d1)
- dict\_bsc.update\_only\_exist\_in\_own(d0,d1)
- dict\_bsc.update\_only\_non\_exist\_in\_own(d0,d1)

- dict\_bsc.length(d)
- dict\_bsc.eq(d0,d1)

- dict\_bsc.to\_map(d)
- dict\_bsc.to\_wmap(d)
- dict\_bsc.cp(d)
- dict\_bsc.gen\_from\_fst(d)
- dict\_bsc.gen\_from\_lst(d)
- dict\_bsc.rekey(d,...ks)
- dict\_bsc.reval(d,...vs)

- dict\_bsc.krekey(d,ok,nk)
- dict\_bsc.vrekey(d,v,nk)
- dict\_bsc.getset(d,k,v)
- dict\_bsc.setnx(d,k,v)
- dict\_bsc.mset(d,...kvs)
- dict\_bsc.msetnx(d,...kvs)

- dict\_bsc.safe\_get(d,key)
- dict\_bsc.safe\_set(d,key,value)


LICENSE
=======
- ISC

