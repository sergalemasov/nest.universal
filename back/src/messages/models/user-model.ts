import { Document } from 'mongoose';
import { UserDto } from './user';

export interface IUserModel extends UserDto, Document {

}
