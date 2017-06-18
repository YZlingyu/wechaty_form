export declare class IoClient {
    private token;
    private log;
    private wechaty;
    private io;
    private state;
    constructor(token?: string, log?: any);
    init(): Promise<void>;
    private initWechaty();
    private initIo();
    initWeb(port?: number): Promise<{}>;
    private onMessage(m);
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    quit(): Promise<void>;
}
export default IoClient;
