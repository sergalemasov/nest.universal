import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageDto } from './models/message';
import { MessagesService } from './messages.service';

const messagesEndpoint = 'api/messages';

@Controller()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(messagesEndpoint)
  async findAllMessages() {
    return await this.messagesService.findAllMessages();
  }

  @UsePipes(new ValidationPipe())
  @Post(messagesEndpoint)
  async saveMessage(@Body() message: MessageDto) {
    this.messagesService.saveMessage(message);
  }
}
