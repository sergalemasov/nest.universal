import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {
  MessageSchema,
  MessageSchemaName
} from './schemas/message.schema';
import {
  UserSchema,
  UserSchemaName
} from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageSchemaName, schema: MessageSchema },
      { name: UserSchemaName, schema: UserSchema }
    ])
  ],
  controllers: [
    MessagesController,
    UserController
  ],
  providers: [
    MessagesService,
    UserService
  ]
})
export class MessagesModule {}
