#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/config");
const io_client_1 = require("../src/io-client");
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
       -------- https://www.chatie.io --------

My super power: download cloud bot from www.chatie.io

__________________________________________________

`;
let token = config_1.Config.token;
if (!token) {
    config_1.log.error('Client', 'token not found: please set WECHATY_TOKEN in environment before run io-client');
    // process.exit(-1)
    token = config_1.Config.DEFAULT_TOKEN;
    config_1.log.warn('Client', `set token to "${token}" for demo purpose`);
}
console.log(welcome);
config_1.log.info('Client', 'Starting for WECHATY_TOKEN: %s', token);
const client = new io_client_1.default(token, config_1.log);
client.init()
    .catch(onError.bind(client));
client.initWeb()
    .catch(onError.bind(client));
function onError(e) {
    config_1.log.error('Client', 'initWeb() fail: %s', e);
    this.quit();
    process.exit(-1);
}
//# sourceMappingURL=io-client.js.map