"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const state_switch_1 = require("state-switch");
const config_1 = require("./config");
// type ContactGetterFunc = {
//   (id: string): Promise<any>
// }
/**
 * Abstract Puppet Class
 */
class Puppet extends events_1.EventEmitter {
    constructor() {
        super();
        this.state = new state_switch_1.StateSwitch('Puppet', 'dead', config_1.log);
    }
}
exports.Puppet = Puppet;
exports.default = Puppet;
//# sourceMappingURL=puppet.js.map