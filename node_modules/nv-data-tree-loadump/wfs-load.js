const sym_data = Symbol("data");

function _init_rele(ro,rt) {return({nd:rt,o:ro})}

function creat_ctx(
    is_oleaf, 
    get_ochildren, 
    creat_then_append_chnd,
    trans_ochild,
    name="WfsCtx",
) {
    class Ctx {
        #unhandled =[];
        #next_unhandled = [];
        #curr;
        #ro;
        #rt;
        ////
        constructor(ro,rt) {
            this.#ro = ro;
            this.#rt = rt;
            this.#rt[sym_data] = ro;
            this.#curr = _init_rele(ro,rt);
            this.#unhandled = [this.#curr];
        }
        ////
        get unhandled_() {return(this.#unhandled)}
        get next_unhandled_() {return(this.#next_unhandled)}
        get curr_() {return(this.#curr)}
        ////
        * [Symbol.iterator]() {
            while(this.#unhandled.length >0) {
                for(let i=0;i<this.#unhandled.length;i++) {
                    let ele = this.#unhandled[i];
                    this.#curr = ele;
                    yield(ele);
                    let pnd= ele.nd;
                    let po=ele.o;
                    if(is_oleaf(po)) {
            
                    } else {
                        let ochildren = get_ochildren(po);
                        let echildren =[];
                        ochildren.forEach(
                            (cho,i) => {
                                 let chnd = creat_then_append_chnd(pnd,cho,i);
                                 cho = trans_ochild(cho);                    
                                 chnd[sym_data]=cho;
                                 echildren.push({nd:chnd,o:cho});
                            }
                        )
                        this.#next_unhandled = this.#next_unhandled.concat(echildren)
                    }
                }
                this.#unhandled = this.#next_unhandled;
                this.#next_unhandled = [];
            }
        }
        ////
        
        build() {Array.from(this);return(this.#rt)}
        reset() {
            this.#curr = _init_rele(ro,rt);
            this.#unhandled = [this.#curr];
            this.#next_unhandled = [];
        }
        ////
        prev() {
            let {nd,o} = this.#curr;
            let prev_nd = nd.$bfs_prev_[0];
            return(prev_nd?{nd:prev_nd,o:prev_nd[sym_data]}:null)
        }
    }
    Object.defineProperty(Ctx,"name",{value:name});
    Ctx.sym_data = sym_data;
    return(Ctx)
}


module.exports = creat_ctx;

