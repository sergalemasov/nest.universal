import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Observer } from 'rxjs';
import { UniversalService } from 'src/universal/universal.service';
import { Message } from './models/message';
import { Event } from './models/event';

import {Socket} from 'socket.io';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:4001';

@Injectable()
export class EventsService {
  private socket: Socket;
  private isInBrowser: boolean;
  private serverEventStub$ = new Subject<any>();

  constructor(private universalService: UniversalService) {
    this.isInBrowser = this.universalService.isInBrowser;
  }

  initSocket(): void {
    if (!this.isInBrowser) {
      return;
    }

    this.socket = socketIo(SERVER_URL);
  }

  send(message: Message): void {
    if (!this.isInBrowser) {
      return;
    }

    this.socket.emit('message', message);
  }

  onMessage(): Observable<Message> {
    if (!this.isInBrowser) {
      return this.serverEventStub$.asObservable();
    }

    return new Observable<Message>((observer: Observer<Message>) => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  onEvent(event: Event): Observable<any> {
    if (!this.isInBrowser) {
      return this.serverEventStub$.asObservable();
    }

    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
