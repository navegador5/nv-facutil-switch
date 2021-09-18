     const {
         cmmn,
         creat_sync_nest_switch,
         creat_async_nest_switch,
         creat_sync_nest_switch_cache,
         creat_async_nest_switch_cache,
    } = require("../index");
    
    

    const tmoutp = require('timers/promises').setTimeout;


var dflt_handler = (r)=>'invalid'

var entries = [//switch@root
    [(r)=>r%6===0, (r)=>r,  /*default:cmmn.break*/],                   
    [
        (r)=>r%6===1,                                      
        [ //switch1@child
            [(r)=>r%7===0,                            (r)=>r,             /*default:cmmn.break*/],  
            [async(r)=>tmoutp(5000,r%7===1),          (r)=>r,             /*default:cmmn.break*/],  
            [(r)=>r%7===2,                            (r)=>r,             /*default:cmmn.break*/],
            {handler:(r)=>'invalid' ,completion:cmmn.break/*default:cmmn.break*/}                        //default CASE of switch1@child
        ],
        cmmn.break                                         // this could be omitted,/*default:cmmn.break*/
    ],
    [(r)=>r%6===2, (r)=>r,  /*default:cmmn.break*/],
    [
        (r)=>r%6===3, 
        [//switch2@child
            [(r)=>r<50,          (r)=>r,             /*default:cmmn.break*/]
            //switch2@child without default CASE 
        ],
        cmmn.break                            // this could be omitted,/*default:cmmn.break*/
    ],
    {handler:async(r)=>tmoutp(5000,`invalid-last`), completion: cmmn.break /*default:cmmn.break*/}                      //default CASE of switch@root
]




var ANestSwitch = creat_async_nest_switch(entries,dflt_handler)
var switcher = new ANestSwitch()

await switcher.handle(6)
await switcher.handle(7)
await switcher.handle(31)
await switcher.handle(8)
await switcher.handle(63)
await switcher.handle(33)
await switcher.handle(34)

/*
> await switcher.handle(6)
6
> await switcher.handle(7)
7
> await switcher.handle(31)
'invalid'
> await switcher.handle(8)
8
> await switcher.handle(63)
undefined
> await switcher.handle(33)
33
> await switcher.handle(34)
'invalid-last'
>

*/

