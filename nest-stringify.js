const {
    is_matcher,
    is_handler,
    is_completion,
    is_dflt_case
} = require("./nest-share");

const {
    is_async_func,
}  = require("nv-facutil-basic");


function paint_ansi8(fg,content,bg,style) {
    if(fg === undefined) {fg = 37}
    if(bg === undefined) {bg = 40}
    if(style === undefined) {style=0}
    let dflt =  "\033[0m"
    let s = "\033[" + style.toString() + ";" + fg.toString()+";" + bg.toString() +"m" + content + dflt
    return(s)
}

function paint_ansi8_underscore(fg,content) {
    return(paint_ansi8(fg,content,40,4))
}


function paint_ansi256(fg,content,bg) {
    if(fg === undefined) {fg = 255}
    if(bg === undefined) {bg = 0}
    let dflt =  "\033[0m"
    let s = "\033[38;5;" + fg.toString() +"m" + "\033[48;5;" +bg.toString() +"m" + content + dflt
    return(s)
}

const CLR = {
    def:{type:'ansi8',fg:94,style:4},
    rtrn:{type:'ansi8',fg:95,style:4},
    let:{type:'ansi8',fg:96,style:4},
    ////
    switch:{type:'ansi8',fg:93,style:4},
    case:{type:'ansi8',fg:92,style:4},   
    default:{type:'ansi8',fg:32,style:4},
    break:{type:'ansi8',fg:91,style:4},
    ////
    lc :{type:'ansi8',fg:34,style:4},
    ////
    await:{type:'ansi8',fg:35,style:4},
    JS:{type:'ansi8',fg:36,style:4},
    ////
    _domain:{type:'ansi256',fg:237}
}

function paint_kw(kw) {
    let typ = CLR[kw].type;
    if(typ === 'ansi8') {
        return(paint_ansi8_underscore(CLR[kw].fg,kw))
    } else {

    }
}

const ___def     = paint_kw('def');
const ___rtrn    = paint_kw('rtrn');
const ___let     = paint_kw('let');
const ___switch  = paint_kw('switch');
const ___case    = paint_kw('case');
const ___default = paint_kw('default');
const ___break   = paint_kw('break');
const ___await   = paint_kw('await');
const ___JS      = (s)=> paint_ansi256(CLR._domain.fg,'<@JS>') +paint_ansi8(CLR.JS.fg,s) + paint_ansi256(CLR._domain.fg,'</@JS>')


function to_str(switcher) {
    let dflt_handler = switcher.dflt_handler_;
    let rt = switcher.tree_;
    let sdfs = rt.$sdfs_;
    ////head
    let arr = [`${___def} my_switch${paint_ansi256(CLR._domain.fg,'@NV')}(v) [`,`    ${___let} rslt;`]
    ////body
    let i = 0;
    while(i<sdfs.length) {
        let nd = sdfs[i];
        let depth = nd.$depth_;
        let indent = "    ".repeat(depth);
        if(is_matcher(nd)) {
            let _await = is_async_func(nd.value_)?`${___await} `:'';
            let JS = ___JS(`${nd.value_.toString().replace(/\n/g,';')}`) 
            let s = indent +`|-${___case} ${_await}[${JS}](v): `;
            arr.push(s)
            i =i +1;
            if(nd.$rsib_===null) {
                s = indent + `|${___break};`
                arr.push(s)
            } else {}
        } else if(is_handler(nd)) {
            let _await = is_async_func(nd.value_)?`${___await} `:'';
            let JS = ___JS(`${nd.value_.toString().replace(/\n/g,';')}`)
            let s = indent +`    |rslt = ${_await}[${JS}](v); `;
            arr.push(s)
            i =i +1;
            if(nd.$rsib_===null) {
                s = indent + `    |${___break};`
                arr.push(s)
            } else {}
        } else if(is_completion(nd)) {
            let bl = nd.value_;
            if(bl) {
                let s = indent +`    |${___break};`;
                arr.push(s)
            } else {}
            i =i +1;
        } else if(is_dflt_case(nd)) {
            arr.push(indent +`    |-${___default}-:`);
            i =i +1;
            let fstch = nd.$fstch_;
            let sndch = fstch.$rsib_;
            if(fstch === null) {
                arr.push(indent +`            |${___break};`);
            } else {
                i =i +1;
                if(fstch.key_ === 'handler') {
                    let _await = is_async_func(fstch.value_)?`${___await} `:'';
                    let JS = ___JS(`${fstch.value_.toString().replace(/\n/g,';')}`);
                    let s = indent +`        |rslt = ${_await}[${JS}](v) `;
                    arr.push(s);
                    if(sndch === null) {
                        let s = indent +`        |${___break}`;
                        arr.push(s)
                    } else {
                        i =i +1;
                        let s = indent +`    `+(sndch.value_?`    |${___break};`:'');
                        arr.push(s);
                    }
                } else {
                    if(sndch === null) {
                         let s = indent +`        `+(sndch.value_?`    |${___break};`:'');
                         arr.push(s);
                    } else {
                        i =i +1;
                        let _await = is_async_func(sndch.value_)?`${___await} `:'';
                        let JS = ___JS(`${sndch.value_.toString().replace(/\n/g,';')}`);
                        let s = indent +`        |rslt = ${_await}[${JS}](v) `;
                        arr.push(s);
                    }
                    let s = indent +`        `+(fstch.value_?`    |${___break};`:'');
                    arr.push(s);
                }
            }
        } else if(nd.$fstch_ && is_matcher(nd.$fstch_)) {
            i =i +1;
        } else {
            if(nd.$is_root()) {
                arr.push(indent + `    ${___switch}(v):`)
            } else {
                arr.push(indent + `    |${___switch}(v):`)
            }
            i =i +1;
        }
    }
    ////foot
    arr.push(`    ${___rtrn}(rslt)`);
    arr.push(']');
    arr = arr.filter(r=>r.trim()!=='');
    arr = arr.map(ln=>'    '+ln)
    return(arr.join('\n'))
}



module.exports = to_str;
