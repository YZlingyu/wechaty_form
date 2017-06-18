"use strict";
/**
 *
 * wechaty: Wechat for Bot. and for human who talk to bot/robot
 *
 * Class IoClient
 * http://www.wechaty.io
 *
 * Licenst: ISC
 * https://github.com/wechaty/wechaty
 *
 */
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
 * DO NOT use `require('../')` here!
 * because it will casue a LOOP require ERROR
 */
// import Brolog   from 'brolog'
const state_switch_1 = require("state-switch");
const config_1 = require("./config");
const io_1 = require("./io");
const wechaty_1 = require("./wechaty");
class IoClient {
    constructor(token = config_1.Config.token || config_1.Config.DEFAULT_TOKEN, log = config_1.log) {
        this.token = token;
        this.log = log;
        this.state = new state_switch_1.StateSwitch('IoClient', 'offline', config_1.log);
        if (!log) {
            const e = new Error('constructor() log(npmlog/brolog) must be set');
            throw e;
        }
        this.log.verbose('IoClient', 'constructor() with token: %s', token);
        if (!token) {
            const e = new Error('constructor() token must be set');
            this.log.error('IoClient', e.message);
            throw e;
        }
        this.wechaty = wechaty_1.Wechaty.instance({
            profile: token,
        });
        this.io = new io_1.Io({
            wechaty: this.wechaty,
            token: this.token,
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'init()');
            if (this.state.inprocess()) {
                const e = new Error('state.inprocess(), skip init');
                this.log.warn('IoClient', 'init() with %s', e.message);
                throw e;
            }
            this.state.target('online');
            this.state.current('online', false);
            try {
                yield this.initIo();
                yield this.initWechaty();
                this.state.current('online');
            }
            catch (e) {
                this.log.error('IoClient', 'init() exception: %s', e.message);
                this.state.current('offline');
                throw e;
            }
            return;
        });
    }
    initWechaty() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'initWechaty()');
            if (this.state.target() !== 'online') {
                const e = new Error('state.target() is not `online`, skipped');
                this.log.warn('IoClient', 'initWechaty() %s', e.message);
                throw e;
            }
            const wechaty = this.wechaty;
            if (!wechaty) {
                throw new Error('no Wechaty');
            }
            wechaty
                .on('login', user => this.log.info('IoClient', `${user.name()} logined`))
                .on('logout', user => this.log.info('IoClient', `${user.name()} logouted`))
                .on('scan', (url, code) => this.log.info('IoClient', `[${code}] ${url}`))
                .on('message', msg => this.onMessage(msg));
            try {
                yield wechaty.init();
                this.log.verbose('IoClient', 'wechaty.init() done');
            }
            catch (e) {
                this.log.error('IoClient', 'init() init fail: %s', e);
                wechaty.quit();
                throw e;
            }
            return;
        });
    }
    initIo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'initIo() with token %s', this.token);
            if (this.state.target() !== 'online') {
                const e = new Error('initIo() targetState is not `connected`, skipped');
                this.log.warn('IoClient', e.message);
                throw e;
            }
            try {
                yield this.io.init();
            }
            catch (e) {
                this.log.verbose('IoClient', 'initIo() init fail: %s', e.message);
                throw e;
            }
            return;
        });
    }
    initWeb(port = config_1.Config.httpPort) {
        //    if (process.env.DYNO) {
        //    }
        const app = require('express')();
        app.get('/', function (req, res) {
            res.send('Wechaty IO Bot Alive!');
        });
        return new Promise((resolve) => {
            app.listen(port, () => {
                this.log.verbose('IoClient', 'initWeb() Wechaty IO Bot listening on port ' + port + '!');
                return resolve(this);
            });
        });
    }
    onMessage(m) {
        // const from = m.from()
        // const to = m.to()
        // const content = m.toString()
        // const room = m.room()
        // this.log.info('Bot', '%s<%s>:%s'
        //               , (room ? '['+room.topic()+']' : '')
        //               , from.name()
        //               , m.toStringDigest()
        //         )
        if (/^wechaty|chatie|botie/i.test(m.content()) && !m.self()) {
            m.say('https://www.wechaty.io')
                .then(_ => this.log.info('Bot', 'REPLIED to magic word "chatie"'));
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'start()');
            if (!this.wechaty) {
                return this.init();
            }
            if (this.state.inprocess()) {
                this.log.warn('IoClient', 'start() with a pending state, not the time');
                throw new Error('pending');
            }
            this.state.target('online');
            this.state.current('online', false);
            try {
                yield this.initIo();
                this.state.current('online');
            }
            catch (e) {
                this.log.error('IoClient', 'start() exception: %s', e.message);
                this.state.current('offline');
                throw e;
            }
            return;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'stop()');
            this.state.target('offline');
            this.state.current('offline', false);
            // XXX
            if (!this.io) {
                this.log.warn('IoClient', 'stop() without this.io');
                // this.currentState('connected')
                this.state.current('offline');
                return;
            }
            yield this.io.quit();
            // .then(_ => this.currentState('disconnected'))
            // .then(_ => this.state.current('offline'))
            this.state.current('offline');
            // XXX 20161026
            // this.io = null
            return;
        });
    }
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'restart()');
            try {
                yield this.stop();
                yield this.start();
            }
            catch (e) {
                this.log.error('IoClient', 'restart() exception %s', e.message);
                throw e;
            }
            return;
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.verbose('IoClient', 'quit()');
            if (this.state.current() === 'offline' && this.state.inprocess()) {
                this.log.warn('IoClient', 'quit() with currentState() = `disconnecting`, skipped');
                throw new Error('quit() with currentState = `disconnecting`');
            }
            this.state.target('offline');
            this.state.current('offline', false);
            try {
                if (this.wechaty) {
                    yield this.wechaty.quit();
                    // this.wechaty = null
                }
                else {
                    this.log.warn('IoClient', 'quit() no this.wechaty');
                }
                if (this.io) {
                    yield this.io.quit();
                    // this.io = null
                }
                else {
                    this.log.warn('IoClient', 'quit() no this.io');
                }
                this.state.current('offline');
            }
            catch (e) {
                this.log.error('IoClient', 'exception: %s', e.message);
                // XXX fail safe?
                this.state.current('offline');
                throw e;
            }
            return;
        });
    }
}
exports.IoClient = IoClient;
exports.default = IoClient;
//# sourceMappingURL=io-client.js.map