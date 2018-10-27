import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit
} from '@nestjs/websockets';
import { Server, Client, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { IMessage } from '../messages/models/message';
import { IUser } from 'messages/models/user';

@WebSocketGateway(4001)
export class EventsGateway implements OnGatewayInit {
  private static messageEventName = 'message';
  private static connectEventName = 'connect';
  private static disconnectEventName = 'disconnect';
  private static socketIdUpdateMessage = 'socket_id_update';

  private socketMap: { [id: string]: Socket } = {};

  @WebSocketServer() server: Server;


  constructor(private eventsService: EventsService) {
  }

  public afterInit() {
    this.eventsService.message$
      .subscribe(message => this.emitMessage(message));

    this.eventsService.giveMeUser$
      .subscribe(socketId => this.emitGiveMeUser(socketId));

    this.subscribeToNewConnections();
  }

  @SubscribeMessage(EventsGateway.socketIdUpdateMessage)
  public onSocketIdUpdate(_client: Client, user: IUser) {
    this.eventsService.onSocketIdUpdate(user);

    this.log<IUser>(EventsGateway.socketIdUpdateMessage, user);
  }

  private emitMessage(message: IMessage) {
    this.log<IMessage>(EventsGateway.messageEventName, message);

    this.server.emit(EventsGateway.messageEventName, { ...message });
  }

  private emitGiveMeUser(socketId: string) {
    this.log<string>(EventsGateway.socketIdUpdateMessage, socketId);

    this.socketMap[socketId].emit(EventsGateway.socketIdUpdateMessage);
  }

  private subscribeToNewConnections() {
    this.server.on(EventsGateway.connectEventName, socket => {
      const socketId = socket.id;

      socket.on(EventsGateway.disconnectEventName, () => this.onSocketDisconnect(socketId));
      this.socketMap[socketId] = socket;

      this.eventsService.onConnect(socketId);
      this.log<string>(EventsGateway.connectEventName, socketId);
    });
  }

  private onSocketDisconnect(socketId: string) {
    this.socketMap[socketId].removeAllListeners();
    this.socketMap[socketId] = undefined;

    this.eventsService.onDisconnect(socketId);

    this.log<string>(EventsGateway.disconnectEventName, socketId);
  }

  private log<T>(eventName: string, eventPayload: T) {
    /* tslint:disable-next-line:no-console */
    console.log(`[server](message:${eventName}): ${JSON.stringify(eventPayload)}`);
  }
}


