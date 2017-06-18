import Message from '../message';
export declare const Firer: {
    checkFriendConfirm: (m: Message) => Promise<void>;
    checkFriendRequest: (m: Message) => Promise<void>;
    checkRoomJoin: (m: Message) => Promise<void>;
    checkRoomLeave: (m: Message) => Promise<void>;
    checkRoomTopic: (m: Message) => Promise<void>;
    parseFriendConfirm: (content: string) => boolean;
    parseRoomJoin: (content: string) => [string[], string];
    parseRoomLeave: (content: string) => [string, string];
    parseRoomTopic: (content: string) => [string, string];
};
export default Firer;
