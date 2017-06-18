/// <reference types="node" />
import { RecommendInfo, Sayable } from './config';
import Contact from './contact';
import Room from './room';
export interface MsgRawObj {
    MsgId: string;
    MMActualSender: string;
    MMPeerUserName: string;
    ToUserName: string;
    MMActualContent: string;
    MMDigest: string;
    MMDisplayTime: number;
    /**
     * MsgType == MSGTYPE_APP && message.AppMsgType == CONF.APPMSGTYPE_URL
     * class="cover" mm-src="{{getMsgImg(message.MsgId,'slave')}}"
     */
    Url: string;
    MMAppMsgDesc: string;
    /**
     * Attachment
     *
     * MsgType == MSGTYPE_APP && message.AppMsgType == CONF.APPMSGTYPE_ATTACH
     */
    FileName: string;
    FileSize: number;
    MediaId: string;
    MMAppMsgFileExt: string;
    MMAppMsgFileSize: string;
    MMAppMsgDownloadUrl: string;
    MMUploadProgress: number;
    /**
     * 模板消息
     * MSGTYPE_APP && message.AppMsgType == CONF.APPMSGTYPE_READER_TYPE
     *  item.url
     *  item.title
     *  item.pub_time
     *  item.cover
     *  item.digest
     */
    MMCategory: any[];
    /**
     * Type
     *
     * MsgType == CONF.MSGTYPE_VOICE : ng-style="{'width':40 + 7*message.VoiceLength/1000}
     */
    MsgType: number;
    AppMsgType: AppMsgType;
    SubMsgType: MsgType;
    /**
     * Status-es
     */
    Status: string;
    MMStatus: number;
    MMFileStatus: number;
    /**
     * Location
     */
    MMLocationUrl: string;
    MMLocationDesc: string;
    /**
     * MsgType == CONF.MSGTYPE_EMOTICON
     *
     * getMsgImg(message.MsgId,'big',message)
     */
    /**
     * Image
     *
     *  getMsgImg(message.MsgId,'slave')
     */
    MMImgStyle: string;
    MMPreviewSrc: string;
    MMThumbSrc: string;
    /**
     * Friend Request & ShareCard ?
     *
     * MsgType == CONF.MSGTYPE_SHARECARD" ng-click="showProfile($event,message.RecommendInfo.UserName)
     * MsgType == CONF.MSGTYPE_VERIFYMSG
     */
    RecommendInfo?: RecommendInfo;
}
export interface MsgObj {
    id: string;
    type: MsgType;
    from: string;
    to?: string;
    room?: string;
    content: string;
    status: string;
    digest: string;
    date: string;
    url?: string;
}
export interface MsgTypeMap {
    [index: string]: string | number;
}
export declare enum AppMsgType {
    TEXT = 1,
    IMG = 2,
    AUDIO = 3,
    VIDEO = 4,
    URL = 5,
    ATTACH = 6,
    OPEN = 7,
    EMOJI = 8,
    VOICE_REMIND = 9,
    SCAN_GOOD = 10,
    GOOD = 13,
    EMOTION = 15,
    CARD_TICKET = 16,
    REALTIME_SHARE_LOCATION = 17,
    TRANSFERS = 2000,
    RED_ENVELOPES = 2001,
    READER_TYPE = 100001,
}
export declare enum MsgType {
    TEXT = 1,
    IMAGE = 3,
    VOICE = 34,
    VERIFYMSG = 37,
    POSSIBLEFRIEND_MSG = 40,
    SHARECARD = 42,
    VIDEO = 43,
    EMOTICON = 47,
    LOCATION = 48,
    APP = 49,
    VOIPMSG = 50,
    STATUSNOTIFY = 51,
    VOIPNOTIFY = 52,
    VOIPINVITE = 53,
    MICROVIDEO = 62,
    SYSNOTICE = 9999,
    SYS = 10000,
    RECALLED = 10002,
}
export declare class Message implements Sayable {
    rawObj: MsgRawObj;
    static counter: number;
    _counter: number;
    /**
     * a map for:
     *   1. name to id
     *   2. id to name
     */
    readonly id: string;
    obj: MsgObj;
    readyStream(): Promise<NodeJS.ReadableStream>;
    filename(): string;
    constructor(rawObj?: MsgRawObj);
    private parse(rawObj);
    toString(): string;
    toStringDigest(): string;
    toStringEx(): string;
    getSenderString(): string;
    getContentString(): string;
    from(contact: Contact): void;
    from(id: string): void;
    from(): Contact;
    to(contact: Contact): void;
    to(id: string): void;
    to(): Contact | null;
    room(room: Room): void;
    room(id: string): void;
    room(): Room | null;
    content(): string;
    content(content: string): void;
    type(): MsgType;
    typeSub(): MsgType;
    typeApp(): AppMsgType;
    typeEx(): string;
    count(): number;
    self(): boolean;
    /**
     *
     * Get message mentioned contactList.
     * message event table as follows
     *
     * |                                                                            | Web  |  Mac PC Client | iOS Mobile |  android Mobile |
     * | :---                                                                       | :--: |     :----:     |   :---:    |     :---:       |
     * | [You were mentioned] tip ([有人@我]的提示)                                   |  ✘   |        √       |     √      |       √         |
     * | Identify magic code (8197) by copy & paste in mobile                       |  ✘   |        √       |     √      |       ✘         |
     * | Identify magic code (8197) by programming                                  |  ✘   |        ✘       |     ✘      |       ✘         |
     * | Identify two contacts with the same roomAlias by [You were  mentioned] tip |  ✘   |        ✘       |     √      |       √         |
     *
     * @returns {Contact[]} return message mentioned contactList
     *
     * @example
     * ```ts
     * const contactList = message.mentioned()
     * console.log(contactList)
     * ```
     */
    mentioned(): Contact[];
    ready(): Promise<void>;
    /**
     * @deprecated
     */
    get(prop: string): string;
    /**
     * @deprecated
     */
    set(prop: string, value: string): this;
    dump(): void;
    dumpRaw(): void;
    static find(query: any): Promise<Message>;
    static findAll(query: any): Promise<Message[]>;
    say(text: string, replyTo?: Contact | Contact[]): Promise<any>;
    say(mediaMessage: MediaMessage, replyTo?: Contact | Contact[]): Promise<any>;
}
export declare class MediaMessage extends Message {
    private bridge;
    private filePath;
    private fileName;
    private fileExt;
    constructor(rawObj: Object);
    constructor(filePath: string);
    ready(): Promise<void>;
    ext(): string;
    filename(): string;
    readyStream(): Promise<NodeJS.ReadableStream>;
}
export default Message;
