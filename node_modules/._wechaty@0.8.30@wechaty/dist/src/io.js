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
 * Wechaty: Wechat for Bot. and for human who talk to bot/robot
 *
 * Class Io
 * http://www.wechaty.io
 *
 * Licenst: ISC
 * https://github.com/zixia/wechaty
 *
 */
const WebSocket = require("ws");
const state_switch_1 = require("state-switch");
const config_1 = require("./config");
class Io {
    constructor(setting) {
        this.setting = setting;
        this.eventBuffer = [];
        this.state = new state_switch_1.StateSwitch('Io', 'offline', config_1.log);
        if (!setting.wechaty || !setting.token) {
            throw new Error('Io must has wechaty & token set');
        }
        setting.apihost = setting.apihost || config_1.Config.apihost;
        setting.protocol = setting.protocol || config_1.Config.DEFAULT_PROTOCOL;
        this.uuid = setting.wechaty.uuid;
        this.protocol = setting.protocol + '|' + setting.wechaty.uuid;
        config_1.log.verbose('Io', 'instantiated with apihost[%s], token[%s], protocol[%s], uuid[%s]', setting.apihost, setting.token, setting.protocol, this.uuid);
    }
    toString() { return 'Class Io(' + this.setting.token + ')'; }
    connected() { return this.ws && this.ws.readyState === WebSocket.OPEN; }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Io', 'init()');
            this.state.target('online');
            this.state.current('online', false);
            try {
                yield this.initEventHook();
                yield this.initWebSocket();
                this.state.current('online');
                return;
            }
            catch (e) {
                config_1.log.warn('Io', 'init() exception: %s', e.message);
                this.state.current('offline');
                throw e;
            }
        });
    }
    initWebSocket() {
        config_1.log.verbose('Io', 'initWebSocket()');
        this.state.current('online', false);
        // const auth = 'Basic ' + new Buffer(this.setting.token + ':X').toString('base64')
        const auth = 'Token ' + this.setting.token;
        const headers = { 'Authorization': auth };
        if (!this.setting.apihost) {
            throw new Error('no apihost');
        }
        let endpoint = 'wss://' + this.setting.apihost + '/v0/websocket';
        // XXX quick and dirty: use no ssl for APIHOST other than official
        if (!/api\.wechaty\.io/.test(this.setting.apihost)) {
            endpoint = 'ws://' + this.setting.apihost + '/v0/websocket';
        }
        const ws = this.ws = new WebSocket(endpoint, this.protocol, { headers });
        ws.on('open', () => {
            if (this.protocol !== ws.protocol) {
                config_1.log.error('Io', 'initWebSocket() require protocol[%s] failed', this.protocol);
                // XXX deal with error?
            }
            config_1.log.verbose('Io', 'initWebSocket() connected with protocol [%s]', ws.protocol);
            // this.currentState('connected')
            this.state.current('online');
            // FIXME: how to keep alive???
            // ws._socket.setKeepAlive(true, 100)
            this.reconnectTimeout = null;
            const initEvent = {
                name: 'sys',
                payload: 'Wechaty version ' + this.setting.wechaty.version() + ` with UUID: ${this.uuid}`,
            };
            this.send(initEvent);
        });
        ws.on('message', (data, flags) => {
            config_1.log.silly('Io', 'initWebSocket() ws.on(message): %s', data);
            // flags.binary will be set if a binary data is received.
            // flags.masked will be set if the data was masked.
            const ioEvent = {
                name: 'raw',
                payload: data,
            };
            try {
                const obj = JSON.parse(data);
                ioEvent.name = obj.name;
                ioEvent.payload = obj.payload;
            }
            catch (e) {
                config_1.log.verbose('Io', 'on(message) recv a non IoEvent data[%s]', data);
            }
            switch (ioEvent.name) {
                case 'botie':
                    const payload = ioEvent.payload;
                    if (payload.onMessage) {
                        const script = payload.script;
                        /* tslint:disable:no-eval */
                        const fn = eval(script);
                        if (typeof fn === 'function') {
                            this.onMessage = fn;
                        }
                        else {
                            config_1.log.warn('Io', 'server pushed function is invalid');
                        }
                    }
                    break;
                case 'reset':
                    config_1.log.verbose('Io', 'on(reset): %s', ioEvent.payload);
                    this.setting.wechaty.reset(ioEvent.payload);
                    break;
                case 'shutdown':
                    config_1.log.warn('Io', 'on(shutdown): %s', ioEvent.payload);
                    process.exit(0);
                    break;
                case 'update':
                    config_1.log.verbose('Io', 'on(report): %s', ioEvent.payload);
                    const user = this.setting.wechaty.puppet ? this.setting.wechaty.puppet.user : null;
                    if (user) {
                        const loginEvent = {
                            name: 'login',
                            // , payload:  user.obj
                            payload: user.obj,
                        };
                        this.send(loginEvent);
                    }
                    // XXX: Puppet should not has `scan` variable ...
                    const scan = this.setting.wechaty
                        && this.setting.wechaty.puppet
                        && this.setting.wechaty.puppet['scan'];
                    if (scan) {
                        const scanEvent = {
                            name: 'scan',
                            payload: scan,
                        };
                        this.send(scanEvent);
                    }
                    break;
                case 'sys':
                    // do nothing
                    break;
                default:
                    config_1.log.warn('Io', 'UNKNOWN on(%s): %s', ioEvent.name, ioEvent.payload);
                    break;
            }
        });
        ws.on('error', e => {
            config_1.log.warn('Io', 'initWebSocket() error event[%s]', e.message);
            this.setting.wechaty.emit('error', e);
            // when `error`, there must have already a `close` event
            // we should not call this.reconnect() again
            //
            // this.close()
            // this.reconnect()
        })
            .on('close', (code, message) => {
            config_1.log.warn('Io', 'initWebSocket() close event[%d: %s]', code, message);
            ws.close();
            this.reconnect();
        });
        return Promise.resolve(ws);
    }
    reconnect() {
        config_1.log.verbose('Io', 'reconnect()');
        if (this.state.target() === 'offline') {
            config_1.log.warn('Io', 'reconnect() canceled because state.target() === offline');
            return;
        }
        if (this.connected()) {
            config_1.log.warn('Io', 'reconnect() on a already connected io');
            return;
        }
        if (this.reconnectTimer) {
            config_1.log.warn('Io', 'reconnect() on a already re-connecting io');
            return;
        }
        if (!this.reconnectTimeout) {
            this.reconnectTimeout = 1;
        }
        else if (this.reconnectTimeout < 10000) {
            this.reconnectTimeout *= 3;
        }
        config_1.log.warn('Io', 'reconnect() will reconnect after %d s', Math.floor(this.reconnectTimeout / 1000));
        this.reconnectTimer = setTimeout(_ => {
            this.reconnectTimer = null;
            this.initWebSocket();
        }, this.reconnectTimeout); // as any as NodeJS.Timer
    }
    initEventHook() {
        config_1.log.verbose('Io', 'initEventHook()');
        const wechaty = this.setting.wechaty;
        wechaty.on('message', this.ioMessage);
        wechaty.on('scan', (url, code) => this.send({ name: 'scan', payload: { url, code } }));
        wechaty.on('login', user => this.send({ name: 'login', payload: user }));
        wechaty.on('logout', user => this.send({ name: 'login', payload: user }));
        wechaty.on('heartbeat', data => this.send({ name: 'heartbeat', payload: { uuid: this.uuid, data } }));
        wechaty.on('error', error => this.send({ name: 'error', payload: error }));
        // const hookEvents: WechatyEventName[] = [
        //   'scan'
        //   , 'login'
        //   , 'logout'
        //   , 'heartbeat'
        //   , 'error'
        // ]
        // hookEvents.map(event => {
        //   wechaty.on(event, (data) => {
        //     const ioEvent: IoEvent = {
        //       name:       event
        //       , payload:  data
        //     }
        //     switch (event) {
        //       case 'login':
        //       case 'logout':
        //         if (data instanceof Contact) {
        //           // ioEvent.payload = data.obj
        //           ioEvent.payload = data
        //         }
        //         break
        //       case 'error':
        //         ioEvent.payload = data.toString()
        //         break
        //   case 'heartbeat':
        //     ioEvent.payload = {
        //       uuid: this.uuid
        //       , data: data
        //     }
        //     break
        //   default:
        //     break
        // }
        //     this.send(ioEvent)
        //   })
        // })
        // wechaty.on('message', m => {
        //   const text = (m.room() ? '[' + m.room().topic() + ']' : '')
        //               + '<' + m.from().name() + '>'
        //               + ':' + m.toStringDigest()
        //   this.send({ name: 'message', payload:  text })
        // })
        return;
    }
    send(ioEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ioEvent) {
                config_1.log.silly('Io', 'send(%s: %s)', ioEvent.name, ioEvent.payload);
                this.eventBuffer.push(ioEvent);
            }
            else {
                config_1.log.silly('Io', 'send()');
            }
            if (!this.connected()) {
                config_1.log.verbose('Io', 'send() without a connected websocket, eventBuffer.length = %d', this.eventBuffer.length);
                return;
            }
            const list = [];
            while (this.eventBuffer.length) {
                const p = new Promise((resolve, reject) => this.ws.send(JSON.stringify(this.eventBuffer.shift()), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }));
                list.push(p);
            }
            try {
                yield Promise.all(list);
            }
            catch (e) {
                config_1.log.error('Io', 'send() exceptio: %s', e.stack);
                throw e;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Io', 'close()');
            this.state.target('offline');
            this.state.current('offline', false);
            this.ws.close();
            this.state.current('offline');
            // TODO: remove listener for this.setting.wechaty.on(message )
            return Promise.resolve();
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.target('offline');
            this.state.current('offline', false);
            // try to send IoEvents in buffer
            yield this.send();
            this.eventBuffer = [];
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
            yield this.close();
            // this.currentState('disconnected')
            this.state.current('offline');
            return Promise.resolve();
        });
    }
    /**
     *
     * Prepare to be overwriten by server setting
     *
     */
    ioMessage(m) {
        config_1.log.verbose('Io', 'ioMessage() is a nop function before be overwriten from cloud');
    }
}
exports.Io = Io;
exports.default = Io;
//# sourceMappingURL=io.js.map