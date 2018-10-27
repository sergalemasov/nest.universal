import { Document } from 'mongoose';
import { IUser } from './user';

export interface IUserModel extends IUser, Document {

}
