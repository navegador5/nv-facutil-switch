const {
    creat_sync_simple_switch,
    creat_async_simple_switch,
} = require("./simple");

const {
    creat_sync_simple_switch_cache,
    creat_async_simple_switch_cache,
} = require("./simple-cache");


const {
    creat_sync_nest_switch,
    creat_async_nest_switch,
} = require("./nest");

const {
    creat_sync_nest_switch_cache,
    creat_async_nest_switch_cache,
} = require("./nest-cache");


module.exports = {
    cmmn:require("./cmmn"),
    creat_sync_simple_switch,
    creat_async_simple_switch,
    creat_sync_simple_switch_cache,
    creat_async_simple_switch_cache,
    creat_sync_nest_switch,
    creat_async_nest_switch,
    creat_sync_nest_switch_cache,
    creat_async_nest_switch_cache,
}
