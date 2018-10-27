import { Document } from 'mongoose';
import { IMessage } from './message';

export interface IMessageModel extends IMessage, Document {

}
