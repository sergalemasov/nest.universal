import { Controller, Get, Post, Body } from '@nestjs/common';
import { IMessage } from './models/message';
import { MessagesService } from './messages.service';

@Controller()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('api/messages')
  async findAllMessages() {
    return await this.messagesService.findAllMessages();
  }

  @Post('api/messages')
  async saveMessage(@Body() message: IMessage) {
    this.messagesService.saveMessage(message);
  }
}
