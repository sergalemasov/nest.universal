import * as mongoose from 'mongoose';

export const UserSchemaName = 'User';

export const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  socketId: String
});
