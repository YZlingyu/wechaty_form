/// <reference types="node" />
import { Sayable } from './config';
import { MediaMessage } from './message';
export interface ContactObj {
    address: string;
    city: string;
    id: string;
    name: string;
    province: string;
    alias: string | null;
    sex: Gender;
    signature: string;
    star: boolean;
    stranger: boolean;
    uin: string;
    weixin: string;
    avatar: string;
    official: boolean;
    special: boolean;
}
export interface ContactRawObj {
    Alias: string;
    City: string;
    NickName: string;
    Province: string;
    RemarkName: string;
    Sex: Gender;
    Signature: string;
    StarFriend: string;
    Uin: string;
    UserName: string;
    HeadImgUrl: string;
    stranger: string;
    VerifyFlag: number;
}
/**
 * Enum for Gender values.
 * @enum {number}
 */
export declare enum Gender {
    Unknown = 0,
    Male = 1,
    Female = 2,
}
export interface ContactQueryFilter {
    name?: string | RegExp;
    alias?: string | RegExp;
    remark?: string | RegExp;
}
/**
 * Class Contact
 *
 * `Contact` is `Sayable`
 */
export declare class Contact implements Sayable {
    readonly id: string;
    private static pool;
    obj: ContactObj | null;
    private dirtyObj;
    private rawObj;
    constructor(id: string);
    toString(): string;
    toStringEx(): string;
    private parse(rawObj);
    /**
     * Get the weixin number from a contact
     * Sometimes cannot get weixin number due to weixin security mechanism, not recommend.
     * @returns {string | null}
     *
     * @example
     * ```ts
     * const weixin = contact.weixin()
     * ```
     */
    weixin(): string | null;
    /**
     * Get the name from a contact
     *
     * @returns {string}
     *
     * @example
     * ```ts
     * const name = contact.name()
     * ```
     */
    name(): string;
    /**
     * Check if contact is stranger
     *
     * @returns {boolean | null} True for not friend of the bot, False for friend of the bot, null for cannot get the info.
     *
     * @example
     * ```ts
     * const isStranger = contact.stranger()
     * ```
     */
    stranger(): boolean | null;
    /**
     * Check if it's a offical account
     *
     * @returns {boolean|null} True for official account, Flase for contact is not a official account
     *
     * @example
     * ```ts
     * const isOfficial = contact.official()
     * ```
     */
    official(): boolean;
    /**
     * Check if it's a special contact
     *
     * the contact who's id in following list will be identify as a special contact
     *
     * ```ts
     * 'weibo', 'qqmail', 'fmessage', 'tmessage', 'qmessage', 'qqsync', 'floatbottle',
     * 'lbsapp', 'shakeapp', 'medianote', 'qqfriend', 'readerapp', 'blogapp', 'facebookapp',
     * 'masssendapp', 'meishiapp', 'feedsapp', 'voip', 'blogappweixin', 'weixin', 'brandsessionholder',
     * 'weixinreminder', 'wxid_novlwrv3lqwv11', 'gh_22b87fa7cb3c', 'officialaccounts', 'notification_messages',
     * ```
     * @see https://github.com/Chatie/webwx-app-tracker/blob/7c59d35c6ea0cff38426a4c5c912a086c4c512b2/formatted/webwxApp.js#L3848
     *
     * @returns {boolean|null} True for brand, Flase for contact is not a brand
     *
     * @example
     * ```ts
     * const isSpecial = contact.special()
     * ```
     */
    special(): boolean;
    /**
     * Check if it's a personal account
     *
     * @returns {boolean|null} True for personal account, Flase for contact is not a personal account
     *
     * @example
     * ```ts
     * const isPersonal = contact.personal()
     * ```
     */
    personal(): boolean;
    /**
     * Check if the contact is star contact.
     *
     * @returns {boolean} True for star friend, False for no star friend, null for cannot get the info.
     *
     * @example
     * ```ts
     * const isStar = contact.star()
     * ```
     */
    star(): boolean | null;
    /**
     * Contact gender
     *
     * @returns Gender.Male(2) | Gender.Female(1) | Gender.Unknown(0)
     *
     * @example
     * ```ts
     * const gender = contact.gender()
     * ```
     */
    gender(): Gender;
    /**
     * Get the region 'province' from a contact
     *
     * @returns {string | undefined}
     *
     * @example
     * ```ts
     * const province = contact.province()
     * ```
     */
    province(): string | null;
    /**
     * Get the region 'city' from a contact
     *
     * @returns {string | undefined}
     *
     * @example
     * ```ts
     * const city = contact.city()
     * ```
     */
    city(): string | null;
    /**
     * Get avatar picture file stream
     *
     * @returns {Promise<NodeJS.ReadableStream>}
     *
     * @example
     * ```ts
     * const avatarFileName = contact.name() + `.jpg`
     * const avatarReadStream = await contact.avatar()
     * const avatarWriteStream = createWriteStream(avatarFileName)
     * avatarReadStream.pipe(avatarWriteStream)
     * log.info('Bot', 'Contact: %s: %s with avatar file: %s', contact.weixin(), contact.name(), avatarFileName)
     * ```
     */
    avatar(): Promise<NodeJS.ReadableStream>;
    get(prop: any): any;
    isReady(): boolean;
    /**
     * Force reload data for Contact
     *
     * @returns {Promise<this>}
     *
     * @example
     * ```ts
     * await contact.refresh()
     * ```
     */
    refresh(): Promise<this>;
    ready(contactGetter?: (id: string) => Promise<ContactRawObj>): Promise<this>;
    dumpRaw(): void;
    dump(): void;
    /**
     * Check if contact is self
     *
     * @returns {boolean} True for contact is self, False for contact is others
     *
     * @example
     * ```ts
     * const isSelf = contact.self()
     * ```
     */
    self(): boolean;
    /**
     * find contact by `name` or `alias`
     *
     * If use Contact.findAll() get the contact list of the bot.
     *
     * #### definition
     * - `name` the name-string set by user-self, should be called name
     * - `alias` the name-string set by bot for others, should be called alias
     *
     * @static
     * @param {ContactQueryFilter} [queryArg]
     * @returns {Promise<Contact[]>}
     *
     * @example
     * ```ts
     * // get the contact list of the bot
     * const contactList = await Contact.findAll()
     * // find allof the contacts whose name is 'ruirui'
     * const contactList = await Contact.findAll({name: 'ruirui'})
     * // find allof the contacts whose alias is 'lijiarui'
     * const contactList = await Contact.findAll({alias: 'lijiarui'})
     * ```
     */
    static findAll(queryArg?: ContactQueryFilter): Promise<Contact[]>;
    /**
     * GET the alias for contact
     *
     * @returns {(string | null)}
     *
     * @example
     * ```ts
     * const alias = contact.alias()
     * ```
     */
    alias(): string | null;
    /**
     * SET the alias for contact
     *
     * tests show it will failed if set alias too frequently(60 times in one minute).
     *
     * @param {string} newAlias
     * @returns {Promise<boolean>} A promise to the result. true for success, false for failure
     *
     * @example
     * ```ts
     * const ret = await contact.alias('lijiarui')
     * if (ret) {
     *   console.log(`change ${contact.name()}'s alias successfully!`)
     * } else {
     *   console.error('failed to change ${contact.name()}'s alias!')
     * }
     * ```
     */
    alias(newAlias: string): Promise<boolean>;
    /**
     * DELETE the alias for a contact
     *
     * @param {null} empty
     * @returns {Promise<boolean>}
     *
     * @example
     * ```ts
     * const ret = await contact.alias(null)
     * if (ret) {
     *   console.log(`delete ${contact.name()}'s alias successfully!`)
     * } else {
     *   console.log(`failed to delete ${contact.name()}'s alias!`)
     * }
     * ```
     */
    alias(empty: null): Promise<boolean>;
    remark(newRemark?: string | null): Promise<boolean> | string | null;
    /**
     * try to find a contact by filter: {name: string | RegExp} / {alias: string | RegExp}
     * @description Find contact by name or alias, if the result more than one, return the first one.
     * @static
     * @param {ContactQueryFilter} query
     * @returns {(Promise<Contact | null>)} If can find the contact, return Contact, or return null
     *
     * @example
     * ```ts
     * const contactFindByName = await Contact.find({ name:"ruirui"} )
     * const contactFindByAlias = await Contact.find({ alias:"lijiarui"} )
     * ```
     */
    static find(query: ContactQueryFilter): Promise<Contact | null>;
    /**
     * Load data for Contact by id
     *
     * @static
     * @param {string} id
     * @returns {Contact}
     *
     * @example
     * ```ts
     * // fake: contactId = @0bb3e4dd746fdbd4a80546aef66f4085
     * const contact = Contact.load('@0bb3e4dd746fdbd4a80546aef66f4085')
     * ```
     */
    static load(id: string): Contact;
    /**
     * Say `content` to Contact
     *
     * @param {string} content
     * @returns {Promise<void>}
     *
     * @example
     * ```ts
     * await contact.say('welcome to wechaty!')
     * ```
     */
    say(text: string): any;
    say(mediaMessage: MediaMessage): any;
}
export default Contact;
