import { IUser } from './user';
import { Action } from './action';

export interface IMessage {
  from: IUser;
  action?: Action;
  content?: string;
  previousName?: string;
}
