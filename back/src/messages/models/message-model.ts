import { Document } from 'mongoose';
import { MessageDto } from './message';

export interface IMessageModel extends MessageDto, Document {

}
