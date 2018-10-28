import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { MessageDto } from '../messages/models/message';
import { UserDto } from '../messages/models/user';

@Injectable()
export class EventsService {
  private _message$ = new Subject<MessageDto>();
  private _giveMeUser$ = new Subject<string>();
  private _disconnect$ = new Subject<string>();
  private _connect$ = new Subject<string>();
  private _socketIdUpdate$ = new Subject<UserDto>();

  public get message$(): Observable<MessageDto> {
    return this._message$.asObservable();
  }

  public get disconnect$(): Observable<string> {
    return this._disconnect$.asObservable();
  }

  public get connect$(): Observable<string> {
    return this._connect$.asObservable();
  }

  public get socketIdUpdate$(): Observable<UserDto> {
    return this._socketIdUpdate$.asObservable();
  }

  public get giveMeUser$(): Observable<string> {
    return this._giveMeUser$.asObservable();
  }

  public emitMessage(message: MessageDto) {
    this._message$.next(message);
  }

  public giveMeUser(socketId: string) {
    this._giveMeUser$.next(socketId);
  }

  public onDisconnect(socketId: string) {
    this._disconnect$.next(socketId);
  }

  public onConnect(socketId: string) {
    this._connect$.next(socketId);
  }

  public onSocketIdUpdate(user: UserDto) {
    this._socketIdUpdate$.next(user);
  }
}
