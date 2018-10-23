import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { of, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from './models/message';
import { Server, Client } from 'socket.io';

@WebSocketGateway(4001)
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  onEvent(_client, message: Message) {
    /* tslint:disable-next-line:no-console */
    console.log(`[server](message): ${JSON.stringify(message)}`);

    this.server.emit('message', {...message });
  }
}
