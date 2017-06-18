import Contact from './contact';
export declare abstract class FriendRequest {
    contact: Contact;
    hello: string;
    type: 'send' | 'receive' | 'confirm';
    constructor();
    abstract send(contact: Contact, hello: string): Promise<boolean>;
    abstract accept(): Promise<boolean>;
}
export default FriendRequest;
