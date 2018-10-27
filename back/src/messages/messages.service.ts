import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventsService } from '../events/events.service';
import { IMessageModel } from './models/message-model';
import { IMessage } from './models/message';
import { MessageSchemaName } from './schemas/message.schema';
import { Action } from './models/action';
import { UserService } from './user.service';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(MessageSchemaName) private readonly messageModel: Model<IMessageModel>,
              private eventsService: EventsService,
              private userService: UserService) {
    this.subscribeToDisconnect();
  }

  public async saveMessage(message: IMessage): Promise<IMessageModel> {
    const user = message.from;

    if (!user) {
      return;
    }

    const createdMessage = new this.messageModel(message);
    const [result] = await Promise.all([
      createdMessage.save(),
      this.userService.updateSocketId(user)
    ]);

    if (message.action === Action.RENAME) {
      this.userService.updateName(user);
    }

    this.eventsService.emitMessage(message);

    return result;
  }

  public async findAllMessages(): Promise<IMessageModel[]> {
    const messages = await this.messageModel.find().exec();

    return messages && messages.length
      ? messages.filter(message => !!message.from)
      : [];
  }

  private subscribeToDisconnect() {
    this.eventsService.disconnect$
      .subscribe(async socketId => {
        const user = await this.userService.getBySocketId(socketId);

        if (!user) {
          return;
        }

        await this.saveMessage({
          from: user,
          action: Action.LEFT
        });
      });
  }
}
