const {
    actkl_to_actnl,
    actnl_to_actkl
} = require("nv-data-tree-actdef")
const {jdcp} = require("nv-facutil-basic")



function dump(nd,dump_func=jdcp) {
    let struct = nd.$sdfs_next_build_action_list_;
    struct = struct.map(r=>(r.k))
    struct = actkl_to_actnl(struct)
    let data = nd.$sdfs_.map(r=>dump_func(r));
    return({struct,data})
}

const DFLT_LOAD_FUNC = (nd,data)=> {
    Object.assign(nd,data)
    return(nd)
}


function load_from_dump(dumped,forest,Node,load_func=DFLT_LOAD_FUNC) {
    let {struct,data} = dumped;
    let build_al = actnl_to_actkl(struct)
    let rt = forest.tree(Node);
    load_func(rt,data[0]);
    let curr = rt;
    let c =1;
    for(let i=1;i<build_al.length;i++) {
        let act = build_al[i]
        if(!act.endsWith("_")) {
            curr = curr[act]();
            load_func(curr,data[c]);
            c = c+1;
        } else {
            curr = curr[act]
        }
    }
    return(rt)
}

////
const nest = require("./nest");

////



function add_dump(Node) {
    Node.prototype.$dump = function(dump_func=jdcp) {
        return(dump(this,dump_func))
    }
    Node.DFLT_LOAD_FUNC = DFLT_LOAD_FUNC;
    Node.prototype.$to_nest = function(dump_func=jdcp,ck='_children') {
        return(nest.dump(this,dump_func,ck))
    }
    Node.DFLT_NEST_LOAD_FUNC = nest.DFLT_NEST_LOAD_FUNC;
}

const wfs_load = require("./wfs-load");


module.exports = {
    dump,
    DFLT_LOAD_FUNC,
    load_from_dump,
    add_dump,
    nest,
    wfs_load,
}
