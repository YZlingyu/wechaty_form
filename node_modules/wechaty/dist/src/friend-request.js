"use strict";
/**
 * Wechaty - Wechat for Bot. Connecting ChatBots
 *
 * Interface for puppet
 *
 * Class FriendRequest
 *
 * Licenst: ISC
 * https://github.com/wechaty/wechaty
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
class FriendRequest {
    constructor() {
        config_1.log.verbose('FriendRequest', 'constructor()');
        if (!config_1.Config.puppetInstance()) {
            throw new Error('no Config.puppetInstance() instanciated');
        }
    }
}
exports.FriendRequest = FriendRequest;
exports.default = FriendRequest;
//# sourceMappingURL=friend-request.js.map