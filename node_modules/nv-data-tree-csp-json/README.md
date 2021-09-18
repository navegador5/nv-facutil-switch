nv-data-tree-csp-json
=================
- nv-data-tree-csp-json
- json relation tree,support such as: parent,sibling.... 



install
=======
- npm install nv-data-tree-csp-json

usage
=====

        const Forest = require('nv-data-tree-csp-forest');
          
        const {
            creat_undefined,
            creat_null,
            creat_true,
            creat_false,
            creat_str,
            creat_number,
            creat_ary,
            creat_obj,
            creat_external,
            creat_ref,
            is_jleaf,
            load_from_json,
        } = require("nv-data-tree-csp-json");


### from\_json

        var j = {
            undef: undefined,
            null: null,
            n1: 1,
            n2: 2,
            n3: 3,
            t: true,
            f: false,
            ary: [ 'a', 'b', 'c' ]
        }
        var [nd,forest] = load_from_json(j)


####

        > nd.show()
        {
          undef: undefined,
          null: null,
          n1: 1,
          n2: 2,
          n3: 3,
          t: true,
          f: false,
          ary: [...<3 unshow>...]
        }
       > nd.get('ary').show()
       [ "a", "b", "c" ]
       > nd
       {
         undef: undefined,
         null: null,
         n1: 1,
         n2: 2,
         n3: 3,
         t: true,
         f: false,
         ary: [ "a", "b", "c" ]
       }
       >
       > nd.json()
       {
         undef: undefined,
         null: null,
         n1: 1,
         n2: 2,
         n3: 3,
         t: true,
         f: false,
         ary: [ 'a', 'b', 'c' ]
       }
       >
       > nd.stringify()
       '{"null":null,"n1":1,"n2":2,"n3":3,"t":true,"f":false,["a","b","c"]}'
       > nd.get('ary')
       [ 'a', 'b', 'c' ]
       >
       > nd.get('ary').get(1)
       'b'
       > nd.get('ary').get(1).$parent_
       [ 'a', 'b', 'c' ]
       >       
 

### 

        var forest = new Forest(10000);  //10000 max-supported nodes, must < 2**29


        var o = creat_obj(forest)
        o.show()
        o.append_undefined('undef')
        o.append_null('null')
        o.append_number("n1",1)
        o.append_number("n2",2)
        o.append_number("n3",3)
        o.append_true("t")
        o.append_false("f")

        o.append_ary("ary")
        var ary = o.get('ary')
        ary.show()
        ary.append_str("a")
        ary.append_str("b")
        ary.append_str("c")

        > o
        {
          undef: undefined,
          null: null,
          n1: 1,
          n2: 2,
          n3: 3,
          t: true,
          f: false,
          ary: [ 'a', 'b', 'c' ]
        }
        >

    
###


    > o.get('ary').get(1)
    b
    > o.get('ary').get(1).$parent_
    [ a, b, c ]
    >

    > o.stringify()
    '{"null":null,"n1":1,"n2":2,"n3":3,"t":true,"f":false,["a","b","c"]}'
    >


    > o.json()
    {
      undef: undefined,
      null: null,
      n1: 1,
      n2: 2,
      n3: 3,
      t: true,
      f: false,
      ary: [ 'a', 'b', 'c' ]
    }
    >
   
   
###
   
    > o.$sedfs_
    [
      [
        {
          undef: undefined,
          null: null,
          n1: 1,
          n2: 2,
          n3: 3,
          t: true,
          f: false,
          ary: [Array]
        },
        'open'
      ],
      [ undefined, 'open' ],
      [ undefined, 'close' ],
      [ null, 'open' ],
      [ null, 'close' ],
      [ 1, 'open' ],
      [ 1, 'close' ],
      [ 2, 'open' ],
      [ 2, 'close' ],
      [ 3, 'open' ],
      [ 3, 'close' ],
      [ true, 'open' ],
      [ true, 'close' ],
      [ false, 'open' ],
      [ false, 'close' ],
      [ [ a, b, c ], 'open' ],
      [ a, 'open' ],
      [ a, 'close' ],
      [ b, 'open' ],
      [ b, 'close' ],
      [ c, 'open' ],
      [ c, 'close' ],
      [ [ 'a', 'b', 'c' ], 'close' ],
      [
        {
          undef: undefined,
          null: null,
          n1: 1,
          n2: 2,
          n3: 3,
          t: true,
          f: false,
          ary: [Array]
        },
        'close'
      ]
    ]
    >    


### proxy

    > o.$_.ary
    Proxy [
      [ 'a', 'b', 'c' ],
      { get: [Function: get], set: [Function: set] }
    ]
    > o.$_.ary[1]
    Proxy [ 'b', { get: [Function: get] } ]
    >
    > o.$_.ary[1] = 'BBB'
    'BBB'
    > o
    {
      undef: undefined,
      null: null,
      n1: 1,
      n2: 2,
      n3: 3,
      t: true,
      f: false,
      ary: [ 'a', 'BBB', 'c' ]
    }
    >    


LICENSE
=======
- ISC 
