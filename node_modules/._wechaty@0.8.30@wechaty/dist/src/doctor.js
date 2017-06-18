"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * wechaty: Wechat for Bot. and for human who talk to bot/robot
 *
 * Licenst: ISC
 * https://github.com/zixia/wechaty
 *
 */
const net_1 = require("net");
const config_1 = require("./config");
class Doctor {
    constructor() {
        config_1.log.verbose('Doctor', 'constructor()');
    }
    chromedriverVersion() {
        const spawn = require('child_process').spawnSync;
        let version;
        try {
            const cmd = spawn('chromedriver', ['--version']);
            version = cmd.error || cmd.stdout.toString() || cmd.stderr.toString();
        }
        catch (e) {
            version = e.message;
        }
        return version;
    }
    /**
     * https://gist.github.com/tedmiston/5935757
     */
    testTcp() {
        config_1.log.verbose('Doctor', 'testTcp()');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            /**
             * Server
             */
            const server = net_1.createServer(socket => socket.pipe(socket));
            /**
             * Promise Reject
             */
            server.on('error', reject);
            server.on('close', () => config_1.log.silly('Doctor', 'testTcp() server closed'));
            server.listen(8788, 'localhost', () => {
                /**
                 * Client
                 */
                const client = new net_1.Socket();
                client.connect(8788, 'localhost', () => {
                    config_1.log.silly('Doctor', 'testTcp() client connected');
                    client.write('ding');
                });
                client.on('data', function (data) {
                    /**
                     * Promise Resolve
                     */
                    resolve(true);
                    client.destroy(); // kill client after server's response
                });
                /**
                 * Promise Reject
                 */
                client.on('error', reject);
                client.on('close', err => server.close());
            });
        }));
    }
}
exports.Doctor = Doctor;
exports.default = Doctor;
//# sourceMappingURL=doctor.js.map