import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { IMessage } from '../messages/models/message';
import { IUser } from '../messages/models/user';

@Injectable()
export class EventsService {
  private _message$ = new Subject<IMessage>();
  private _giveMeUser$ = new Subject<string>();
  private _disconnect$ = new Subject<string>();
  private _connect$ = new Subject<string>();
  private _socketIdUpdate$ = new Subject<IUser>();

  public get message$(): Observable<IMessage> {
    return this._message$.asObservable();
  }

  public get disconnect$(): Observable<string> {
    return this._disconnect$.asObservable();
  }

  public get connect$(): Observable<string> {
    return this._connect$.asObservable();
  }

  public get socketIdUpdate$(): Observable<IUser> {
    return this._socketIdUpdate$.asObservable();
  }

  public get giveMeUser$(): Observable<string> {
    return this._giveMeUser$.asObservable();
  }

  public emitMessage(message: IMessage) {
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

  public onSocketIdUpdate(user: IUser) {
    this._socketIdUpdate$.next(user);
  }
}
