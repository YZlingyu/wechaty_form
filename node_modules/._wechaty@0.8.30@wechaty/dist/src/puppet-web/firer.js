"use strict";
/**
 *
 * Wechaty: * * Wechaty - Wechat for Bot. Connecting ChatBots
 *
 * Class PuppetWeb Firer
 *
 * Process the Message to find which event to FIRE
 *
 * Licenst: ISC
 * https://github.com/wechaty/wechaty
 *
 * Firer for Class PuppetWeb
 *
 * here `this` is a PuppetWeb Instance
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
/* tslint:disable:no-var-requires */
const retryPromise = require('retry-promise').default;
const config_1 = require("../config");
const contact_1 = require("../contact");
const friend_request_1 = require("./friend-request");
/* tslint:disable:variable-name */
exports.Firer = {
    checkFriendConfirm,
    checkFriendRequest,
    checkRoomJoin,
    checkRoomLeave,
    checkRoomTopic,
    parseFriendConfirm,
    parseRoomJoin,
    parseRoomLeave,
    parseRoomTopic,
};
const regexConfig = {
    friendConfirm: [
        /^You have added (.+) as your WeChat contact. Start chatting!$/,
        /^你已添加了(.+)，现在可以开始聊天了。$/,
        /^(.+) just added you to his\/her contacts list. Send a message to him\/her now!$/,
        /^(.+)刚刚把你添加到通讯录，现在可以开始聊天了。$/,
    ],
    roomJoinInvite: [
        /^"?(.+?)"? invited "(.+)" to the group chat$/,
        /^"?(.+?)"?邀请"(.+)"加入了群聊$/,
    ],
    roomJoinQrcode: [
        /^"(.+)" joined the group chat via the QR Code shared by "?(.+?)".$/,
        /^"(.+)" joined the group chat via "?(.+?)"? shared QR Code.$/,
        /^"(.+)"通过扫描"?(.+?)"?分享的二维码加入群聊$/,
    ],
    // no list
    roomLeaveByBot: [
        /^You removed "(.+)" from the group chat$/,
        /^你将"(.+)"移出了群聊$/,
    ],
    roomLeaveByOther: [
        /^You were removed from the group chat by "(.+)"$/,
        /^你被"(.+)"移出群聊$/,
    ],
    roomTopic: [
        /^"?(.+?)"? changed the group name to "(.+)"$/,
        /^"?(.+?)"?修改群名为“(.+)”$/,
    ],
};
function checkFriendRequest(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!m.rawObj) {
            throw new Error('message empty');
        }
        const info = m.rawObj.RecommendInfo;
        config_1.log.verbose('PuppetWebFirer', 'fireFriendRequest(%s)', info);
        if (!info) {
            throw new Error('no info');
        }
        const request = new friend_request_1.default();
        request.receive(info);
        yield request.contact.ready();
        if (!request.contact.isReady()) {
            config_1.log.warn('PuppetWebFirer', 'fireFriendConfirm() contact still not ready after `ready()` call');
        }
        this.emit('friend', request.contact, request);
    });
}
/**
 * try to find FriendRequest Confirmation Message
 */
function parseFriendConfirm(content) {
    const reList = regexConfig.friendConfirm;
    let found = false;
    reList.some(re => !!(found = re.test(content)));
    if (found) {
        return true;
    }
    else {
        return false;
    }
}
function checkFriendConfirm(m) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = m.content();
        config_1.log.silly('PuppetWebFirer', 'fireFriendConfirm(%s)', content);
        if (!parseFriendConfirm(content)) {
            return;
        }
        const request = new friend_request_1.default();
        const contact = m.from();
        request.confirm(contact);
        yield contact.ready();
        if (!contact.isReady()) {
            config_1.log.warn('PuppetWebFirer', 'fireFriendConfirm() contact still not ready after `ready()` call');
        }
        this.emit('friend', contact);
    });
}
/**
 * try to find 'join' event for Room
 *
 * 1.
 *  You've invited "李卓桓" to the group chat
 *  You've invited "李卓桓.PreAngel、Bruce LEE" to the group chat
 * 2.
 *  "李卓桓.PreAngel" invited "Bruce LEE" to the group chat
 *  "凌" invited "庆次、小桔妹" to the group chat
 */
function parseRoomJoin(content) {
    config_1.log.verbose('PuppetWebFirer', 'checkRoomJoin(%s)', content);
    const reListInvite = regexConfig.roomJoinInvite;
    const reListQrcode = regexConfig.roomJoinQrcode;
    let foundInvite = [];
    reListInvite.some(re => !!(foundInvite = content.match(re)));
    let foundQrcode = [];
    reListQrcode.some(re => !!(foundQrcode = content.match(re)));
    if ((!foundInvite || !foundInvite.length) && (!foundQrcode || !foundQrcode.length)) {
        throw new Error('checkRoomJoin() not found matched re of ' + content);
    }
    /**
     * "凌" invited "庆次、小桔妹" to the group chat
     * "桔小秘"通过扫描你分享的二维码加入群聊
     */
    const [inviter, inviteeStr] = foundInvite ? [foundInvite[1], foundInvite[2]] : [foundQrcode[2], foundQrcode[1]];
    const inviteeList = inviteeStr.split(/、/);
    return [inviteeList, inviter]; // put invitee at first place
}
function checkRoomJoin(m) {
    return __awaiter(this, void 0, void 0, function* () {
        const room = m.room();
        if (!room) {
            config_1.log.warn('PuppetWebFirer', 'fireRoomJoin() `room` not found');
            return;
        }
        const content = m.content();
        let inviteeList, inviter;
        try {
            [inviteeList, inviter] = parseRoomJoin(content);
        }
        catch (e) {
            config_1.log.silly('PuppetWebFirer', 'fireRoomJoin() "%s" is not a join message', content);
            return; // not a room join message
        }
        config_1.log.silly('PuppetWebFirer', 'fireRoomJoin() inviteeList: %s, inviter: %s', inviteeList.join(','), inviter);
        let inviterContact = null;
        let inviteeContactList = [];
        try {
            if (inviter === "You've" || inviter === '你' || inviter === 'your') {
                inviterContact = contact_1.default.load(this.userId);
            }
            const max = 20;
            const backoff = 300;
            const timeout = max * (backoff * max) / 2;
            // 20 / 300 => 63,000
            // max = (2*totalTime/backoff) ^ (1/2)
            // timeout = 11,250 for {max: 15, backoff: 100}
            yield retryPromise({ max: max, backoff: backoff }, (attempt) => __awaiter(this, void 0, void 0, function* () {
                config_1.log.silly('PuppetWebFirer', 'fireRoomJoin() retryPromise() attempt %d with timeout %d', attempt, timeout);
                yield room.refresh();
                let inviteeListAllDone = true;
                for (const i in inviteeList) {
                    const loaded = inviteeContactList[i] instanceof contact_1.default;
                    if (!loaded) {
                        const c = room.member(inviteeList[i]);
                        if (!c) {
                            inviteeListAllDone = false;
                            continue;
                        }
                        inviteeContactList[i] = yield c.ready();
                        const isReady = c.isReady();
                        if (!isReady) {
                            inviteeListAllDone = false;
                            continue;
                        }
                    }
                    if (inviteeContactList[i] instanceof contact_1.default) {
                        const isReady = inviteeContactList[i].isReady();
                        if (!isReady) {
                            config_1.log.warn('PuppetWebFirer', 'fireRoomJoin() retryPromise() isReady false for contact %s', inviteeContactList[i].id);
                            inviteeListAllDone = false;
                            yield inviteeContactList[i].refresh();
                            continue;
                        }
                    }
                }
                if (!inviterContact) {
                    inviterContact = room.member(inviter);
                }
                if (inviteeListAllDone && inviterContact) {
                    config_1.log.silly('PuppetWebFirer', 'fireRoomJoin() resolve() inviteeContactList: %s, inviterContact: %s', inviteeContactList.map((c) => c.name()).join(','), inviterContact.name());
                    return;
                }
                throw new Error('not found(yet)');
            })).catch(e => {
                config_1.log.warn('PuppetWebFirer', 'fireRoomJoin() reject() inviteeContactList: %s, inviterContact: %s', inviteeContactList.map((c) => c.name()).join(','), inviter);
            });
            if (!inviterContact) {
                config_1.log.error('PuppetWebFirer', 'firmRoomJoin() inivter not found for %s , `room-join` & `join` event will not fired', inviter);
                return;
            }
            if (!inviteeContactList.every(c => c instanceof contact_1.default)) {
                config_1.log.error('PuppetWebFirer', 'firmRoomJoin() inviteeList not all found for %s , only part of them will in the `room-join` or `join` event', inviteeContactList.join(','));
                inviteeContactList = inviteeContactList.filter(c => (c instanceof contact_1.default));
                if (inviteeContactList.length < 1) {
                    config_1.log.error('PuppetWebFirer', 'firmRoomJoin() inviteeList empty.  `room-join` & `join` event will not fired');
                    return;
                }
            }
            yield Promise.all(inviteeContactList.map(c => c.ready()));
            yield inviterContact.ready();
            yield room.ready();
            this.emit('room-join', room, inviteeContactList, inviterContact);
            room.emit('join', inviteeContactList, inviterContact);
        }
        catch (e) {
            config_1.log.error('PuppetWebFirer', 'exception: %s', e.stack);
        }
        return;
    });
}
function parseRoomLeave(content) {
    const reListByBot = regexConfig.roomLeaveByBot;
    const reListByOther = regexConfig.roomLeaveByOther;
    let foundByBot = [];
    reListByBot.some(re => !!(foundByBot = content.match(re)));
    let foundByOther = [];
    reListByOther.some(re => !!(foundByOther = content.match(re)));
    if ((!foundByBot || !foundByBot.length) && (!foundByOther || !foundByOther.length)) {
        throw new Error('checkRoomLeave() no matched re for ' + content);
    }
    const [leaver, remover] = foundByBot ? [foundByBot[1], this.userId] : [this.userId, foundByOther[1]];
    return [leaver, remover];
}
/**
 * You removed "Bruce LEE" from the group chat
 */
function checkRoomLeave(m) {
    return __awaiter(this, void 0, void 0, function* () {
        config_1.log.verbose('PuppetWebFirer', 'fireRoomLeave(%s)', m.content());
        let leaver, remover;
        try {
            [leaver, remover] = parseRoomLeave(m.content());
        }
        catch (e) {
            return;
        }
        config_1.log.silly('PuppetWebFirer', 'fireRoomLeave() got leaver: %s', leaver);
        const room = m.room();
        if (!room) {
            config_1.log.warn('PuppetWebFirer', 'fireRoomLeave() room not found');
            return;
        }
        /**
         * FIXME: leaver maybe is a list
         * @lijiarui: I have checked, leaver will never be a list. If the bot remove 2 leavers at the same time, it will be 2 sys message, instead of 1 sys message contains 2 leavers.
         */
        let leaverContact, removerContact;
        if (leaver === this.userId) {
            leaverContact = contact_1.default.load(this.userId);
            // not sure which is better
            // removerContact = room.member({contactAlias: remover}) || room.member({name: remover})
            removerContact = room.member(remover);
            if (!removerContact) {
                config_1.log.error('PuppetWebFirer', 'fireRoomLeave() bot is removed from the room, but remover %s not found, event `room-leave` & `leave` will not be fired', remover);
                return;
            }
        }
        else {
            removerContact = contact_1.default.load(this.userId);
            // not sure which is better
            // leaverContact = room.member({contactAlias: remover}) || room.member({name: leaver})
            leaverContact = room.member(remover);
            if (!leaverContact) {
                config_1.log.error('PuppetWebFirer', 'fireRoomLeave() bot removed someone from the room, but leaver %s not found, event `room-leave` & `leave` will not be fired', leaver);
                return;
            }
        }
        yield removerContact.ready();
        yield leaverContact.ready();
        yield room.ready();
        /**
         * FIXME: leaver maybe is a list
         * @lijiarui: I have checked, leaver will never be a list. If the bot remove 2 leavers at the same time, it will be 2 sys message, instead of 1 sys message contains 2 leavers.
         */
        this.emit('room-leave', room, leaverContact, removerContact);
        room.emit('leave', leaverContact, removerContact);
        setTimeout(_ => { room.refresh(); }, 10000); // reload the room data, especially for memberList
    });
}
function parseRoomTopic(content) {
    const reList = regexConfig.roomTopic;
    let found = [];
    reList.some(re => !!(found = content.match(re)));
    if (!found || !found.length) {
        throw new Error('checkRoomTopic() not found');
    }
    const [, changer, topic] = found;
    return [topic, changer];
}
function checkRoomTopic(m) {
    return __awaiter(this, void 0, void 0, function* () {
        let topic, changer;
        try {
            [topic, changer] = parseRoomTopic(m.content());
        }
        catch (e) {
            return;
        }
        const room = m.room();
        if (!room) {
            config_1.log.warn('PuppetWebFirer', 'fireRoomLeave() room not found');
            return;
        }
        const oldTopic = room.topic();
        let changerContact;
        if (/^You$/.test(changer) || /^你$/.test(changer)) {
            changerContact = contact_1.default.load(this.userId);
        }
        else {
            changerContact = room.member(changer);
        }
        if (!changerContact) {
            config_1.log.error('PuppetWebFirer', 'fireRoomTopic() changer contact not found for %s', changer);
            return;
        }
        try {
            yield changerContact.ready();
            yield room.ready();
            this.emit('room-topic', room, topic, oldTopic, changerContact);
            room.emit('topic', topic, oldTopic, changerContact);
            room.refresh();
        }
        catch (e) {
            config_1.log.error('PuppetWebFirer', 'fireRoomTopic() co exception: %s', e.stack);
        }
    });
}
exports.default = exports.Firer;
//# sourceMappingURL=firer.js.map