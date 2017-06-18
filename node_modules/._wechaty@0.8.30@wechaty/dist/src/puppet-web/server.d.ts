/// <reference types="node" />
/// <reference types="socket.io" />
/// <reference types="express" />
import * as https from 'https';
import * as express from 'express';
import { EventEmitter } from 'events';
export declare class Server extends EventEmitter {
    private port;
    private express;
    private httpsServer;
    socketServer: SocketIO.Server | null;
    socketClient: SocketIO.Socket | null;
    constructor(port: number);
    toString(): string;
    init(): Promise<void>;
    /**
     * Https Server
     */
    createHttpsServer(express: express.Application): Promise<https.Server>;
    /**
     * express Middleware
     */
    createExpress(): express.Application;
    /**
     * Socket IO
     */
    createSocketIo(httpsServer: any): SocketIO.Server;
    private initEventsFromClient(client);
    quit(): Promise<void>;
}
export default Server;
