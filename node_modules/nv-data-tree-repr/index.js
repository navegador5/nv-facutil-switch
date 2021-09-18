const {add_repr,add_string_tag,get_abbr} = require("nv-facutil-basic");
const {FLAG_DICT} = require("nv-data-tree-actdef");

////
const FOLDUP_SIGN_DICT = {p:'[+]' ,n:'[-]',l:'[.]'}
const UI_PREFIX_DICT   = { t: ' ├── ', v: ' │   ', l: ' └── ', ws: '     ' }
const REPR_PREFIX_DICT = { t: '├── ', v: '│   ', l: '└── ', ws: '    ' }
////


function _creat_prefix(PREFIX_DICT,nd,dist=0) {
    let prefix=[];
    if(nd.$is_root()) {
        
    } else if(nd.$is_lstch()) {
        prefix.unshift(PREFIX_DICT.l)
    } else {
        prefix.unshift(PREFIX_DICT.t)
    }
    let ances = nd.$ances_;
    for(let i=0;i<ances.length-1;i++) {
        let ance = ances[i]
        if(ance.$is_lstch() ) {
            prefix.unshift(PREFIX_DICT.ws)
        } else {
            prefix.unshift(PREFIX_DICT.v)
        }
    }
    prefix=prefix.slice(dist)
    return(prefix.join(""))
}

function _creat_string_tag(nd) {
    if(nd[nd.constructor.SYM_DICT.get_forest]!==null) {
        return(get_abbr(nd.$fid_)+':'+nd.$id_)
    } else {
        return('')
    }
}

/////
const NATIVE_QUOTE = "%"


/////string tag

function _add_string_tag(Node) {
    add_string_tag(Node,(nd)=>{
        return((nd.$tag_??nd.$id_) +' %'+_creat_string_tag(nd)+'% ')
    })
}

////repr
const _is_repr_leaf = (nd,max_depth=1) => nd.$is_leaf() || (nd.$depth_ === max_depth)


function _repr_sdfs(nd,max_depth) {
    let condf = (nd)=> _is_repr_leaf(nd,max_depth);
    let sdfs = Array.from(nd.$gen_cond_leaf_sdfs_next(condf));
    return(sdfs)
}

const DFLT_REPR_LFN = (nd) =>{ return(nd.$tag_??nd.$id_)}

function _sdfs_repr(nd,max_depth=1,lfn=DFLT_REPR_LFN,max_lines=100) {
    if(nd[nd.constructor.SYM_DICT.get_forest]===null){return('%erased% {}')}
    let head = (nd.$tag_??nd.$id_) +' %'+_creat_string_tag(nd)+'% ' +JSON.stringify(nd,null,4)
    if(nd.$is_leaf() || !nd.$is_repr_enabled()) {
        return(head)
    } else {
        let dist = nd.$depth_
        let repr_sdfs = _repr_sdfs(nd,dist+max_depth);
        let ary = repr_sdfs.slice(0,max_lines);
        for(let i=0;i<ary.length;i++) {
            let dnd = ary[i];
            ary[i] = "    "+_creat_prefix(REPR_PREFIX_DICT,dnd,dist)+lfn(dnd);
            if( dnd.$depth_ === dist+max_depth && !dnd.$is_leaf()){ary[i]=ary[i]+' [...] '} 
        }
        if(repr_sdfs.length>max_lines) {
            ary.push("... "+repr_sdfs.length-max_lines+' more items')
        } else {}
        return(head + ' [\n'+ary.join("\n") + '\n]')
    }
}


function _add_repr(Node,max_depth=1,lfn=DFLT_REPR_LFN,max_lines=100) {
    add_repr(Node,_sdfs_repr,max_depth,lfn,max_lines)
}


////disp
const _is_disp_leaf = (nd) => nd.$is_leaf() || !nd.$is_disp_enabled()

function _disp_sdfs(nd) {
    let sdfs = Array.from(nd.$gen_cond_leaf_sdfs_next(_is_disp_leaf));
    return(sdfs)
}


const _get_foldup_sign = (nd)=> 
    nd.$is_leaf()?FOLDUP_SIGN_DICT.l:
        nd.$is_disp_enabled()?FOLDUP_SIGN_DICT.n : FOLDUP_SIGN_DICT.p


function _sdfs_disp(nd,lfn=DFLT_REPR_LFN) {
    if(nd[nd.constructor.SYM_DICT.get_forest]===null){return('%erased% {}')}
    let head = (nd.$tag_??nd.$id_) + ' %'+_creat_string_tag(nd)+'% ' +JSON.stringify(nd,null,4)
    if(nd.$is_leaf()) {
        return(head)
    } else {
        let dist = nd.$depth_
        let ary = _disp_sdfs(nd);
        for(let i=0;i<ary.length;i++) {
            let dnd = ary[i];
            ary[i] = "    "+_creat_prefix(UI_PREFIX_DICT,dnd,dist)+_get_foldup_sign(dnd) +lfn(dnd);
        }
        return(head + ' [\n'+ary.join("\n") + '\n]')
    }
}

function _add_disp(Node,lfn=DFLT_REPR_LFN) {
    Node.prototype.$display = function(rtrn=false) {
        let s= _sdfs_disp(this,lfn=DFLT_REPR_LFN);
        if(rtrn) {return(s)} else {console.log(s)}
    }
}


////

function _repr_sedfs(nd,max_depth) {
    let condf = (nd)=> _is_repr_leaf(nd,max_depth);
    let sedfs = Array.from(nd.$gen_cond_leaf_sedfs_next(condf));
    return(sedfs)
}


const DFLT_SEDFS_LFN = (nd,flag) =>{ 
    let tag = nd.$tag_??nd.$id_;
    if(flag==='open') {
        return('<'+tag+'>')
    } else {
        return('</'+tag+'>')
    }
}

function _sedfs_repr(nd,max_depth=1,lfn=DFLT_SEDFS_LFN,max_lines=100) {
    if(nd[nd.constructor.SYM_DICT.get_forest]===null){return('%erased% {}')}
    let head = (nd.$tag_??nd.$id_) +' %'+_creat_string_tag(nd)+'% ' +JSON.stringify(nd,null,4)
    let ary =[];
    if(!nd.$is_leaf()){
        let dist = nd.$depth_;
        let sedfs = _repr_sedfs(nd,dist+max_depth);
        let lngth = sedfs.length;
        let ary = sedfs.slice(0,max_lines);
        for(let i=0;i<ary.length;i++) {
            let [dnd,flag] = ary[i];
            let s = "    ".repeat(dnd.$depth_-dist);
            ary[i] = "    "+s+lfn(dnd,flag)
            if( dnd.$depth_ === dist+max_depth && !dnd.$is_leaf() && flag === 'open') {
                ary[i]=ary[i]+'\n'+s+'        <.../>'
            }
        }
        if(lngth>max_lines) {
            ary.push("... "+lngth-max_lines+' more items')
        }
        return(head + ' [\n'+ary.join("\n") + '\n]')
    } else {
        return(head + ' [\n    '+ lfn(nd,'open')+lfn(nd,'close')+ '\n]')
    }
}


function _add_sedfs_repr(Node,max_depth=1,lfn=DFLT_SEDFS_LFN,max_lines=100) {
    add_repr(Node,_sedfs_repr,max_depth,lfn,max_lines)
}



module.exports = {
    NATIVE_QUOTE,
    _add_string_tag,
    FOLDUP_SIGN_DICT,
    REPR_PREFIX_DICT,
    UI_PREFIX_DICT,
    DFLT_REPR_LFN,
    _add_repr,
    _add_disp,
    DFLT_SEDFS_LFN,
    _add_sedfs_repr,
}

