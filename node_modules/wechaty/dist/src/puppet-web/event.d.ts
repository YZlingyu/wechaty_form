/**
 *
 * wechaty: Wechat for Bot. and for human who talk to bot/robot
 *
 * Class PuppetWeb Events
 *
 * use to control wechat in web browser.
 *
 * Licenst: ISC
 * https://github.com/zixia/wechaty
 *
 *
 * Events for Class PuppetWeb
 *
 * here `this` is a PuppetWeb Instance
 *
 */
import { ScanInfo } from '../config';
import { MsgRawObj } from '../message';
import PuppetWeb from './puppet-web';
export declare const Event: {
    onBrowserDead: (this: PuppetWeb, e: Error) => Promise<void>;
    onServerLogin: (this: PuppetWeb, data: any, attempt?: number) => Promise<void>;
    onServerLogout: (this: PuppetWeb, data: any) => void;
    onServerConnection: (data: any) => void;
    onServerDisconnect: (this: PuppetWeb, data: any) => Promise<void>;
    onServerDing: (this: PuppetWeb, data: any) => void;
    onServerScan: (this: PuppetWeb, data: ScanInfo) => Promise<void>;
    onServerLog: (data: any) => void;
    onServerMessage: (this: PuppetWeb, obj: MsgRawObj) => Promise<void>;
};
export default Event;
