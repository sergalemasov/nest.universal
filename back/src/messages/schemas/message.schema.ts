import * as mongoose from 'mongoose';
import { UserSchema } from './user.schema';

export const MessageSchemaName = 'Message';

export const MessageSchema = new mongoose.Schema({
  from: UserSchema,
  action: Number,
  content: String,
  previousName: String
});
