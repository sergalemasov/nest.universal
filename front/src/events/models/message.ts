import { IUser } from './user';
import { Action } from './action';

export interface IMessage {
    from?: IUser;
    content?: string;
    action?: Action;
    previousName?: string;
}
