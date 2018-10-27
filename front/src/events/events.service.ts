import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { UniversalService } from 'src/universal/universal.service';
import { IMessage } from './models/message';
import { PartialType } from 'src/types/partial';

import {Socket} from 'socket.io';
import * as socketIo from 'socket.io-client';
import { IUser } from './models/user';

const SERVER_URL = 'http://localhost:4001';

@Injectable()
export class EventsService {
  private static socketStub = {
    on: function (_event: string | symbol, _listener: (...args: any[]) => void) { return this },
    emit: function (_event: string | symbol, _listener: (...args: any[]) => void) { return this },
    removeListener: function (_event: string | symbol, _listener: (...args: any[]) => void) { return this }
  };
  private static messageEventName = 'message';
  private static connectEventName = 'connect';
  private static disconnectEventName = 'disconnect';
  private static socketIdUpdateMessage = 'socket_id_update';

  private socket: Socket | PartialType<Socket>;

  constructor(private universalService: UniversalService) {
  }

  initSocket(): void {
    this.socket = this.universalService.isInBrowser
      ? socketIo(SERVER_URL)
      : EventsService.socketStub;
  }

  sendMessage(message: IMessage): void {
    this.send<IMessage>(EventsService.messageEventName, message);
  }

  sendSocketIdUpdate(user: IUser): void {
    this.send<IUser>(EventsService.socketIdUpdateMessage, user);
  }

  onMessage(): Observable<IMessage> {
    return this.onEvent<IMessage>(EventsService.messageEventName);
  }

  onConnect(): Observable<string> {
    return this.onEvent<void>(EventsService.connectEventName)
      .pipe(map(() => this.socket.id));
  }

  onDisconnect(): Observable<void> {
    return this.onEvent<void>(EventsService.disconnectEventName);
  }

  onGiveMeUser(): Observable<void> {
    return this.onEvent<void>(EventsService.socketIdUpdateMessage);
  }

  private send<T>(eventName: string, data: T) {
    this.socket.emit(eventName, data);
  }

  private onEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
      const listener = (eventData?: T) => observer.next(eventData);

      this.socket.on(eventName, listener);

      return () => this.socket.removeListener(eventName, listener);
    });
  }
}
