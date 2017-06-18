"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * wechaty: Wechat for Bot. and for human who talk to bot/robot
 *
 * Class PuppetWeb Exportor
 *
 * Licenst: ISC
 * https://github.com/zixia/wechaty
 *
 */
var bridge_1 = require("./bridge");
exports.Bridge = bridge_1.Bridge;
var browser_1 = require("./browser");
exports.Browser = browser_1.Browser;
var event_1 = require("./event");
exports.Event = event_1.Event;
var friend_request_1 = require("./friend-request");
exports.FriendRequest = friend_request_1.PuppetWebFriendRequest;
var server_1 = require("./server");
exports.Server = server_1.Server;
var watchdog_1 = require("./watchdog");
exports.Watchdog = watchdog_1.Watchdog;
const puppet_web_1 = require("./puppet-web");
exports.PuppetWeb = puppet_web_1.default;
exports.default = puppet_web_1.default;
//# sourceMappingURL=index.js.map