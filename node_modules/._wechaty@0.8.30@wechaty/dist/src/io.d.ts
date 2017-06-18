import { Wechaty } from './wechaty';
export interface IoSetting {
    wechaty: Wechaty;
    token: string;
    apihost?: string;
    protocol?: string;
}
export declare class Io {
    private setting;
    uuid: string;
    private protocol;
    private eventBuffer;
    private ws;
    private state;
    private reconnectTimer;
    private reconnectTimeout;
    private onMessage;
    constructor(setting: IoSetting);
    toString(): string;
    private connected();
    init(): Promise<void>;
    private initWebSocket();
    private reconnect();
    private initEventHook();
    private send(ioEvent?);
    private close();
    quit(): Promise<void>;
    /**
     *
     * Prepare to be overwriten by server setting
     *
     */
    private ioMessage(m);
}
export default Io;
