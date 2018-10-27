import {
  Component,
  OnInit,
  ViewChildren,
  ViewChild,
  AfterViewInit,
  QueryList,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem, MatDialogConfig } from '@angular/material';
import { Subject, BehaviorSubject, zip } from 'rxjs';
import { takeUntil, take, switchMap, filter } from 'rxjs/operators';
import * as uuid1 from 'uuid/v1';

import { Action } from 'src/events/models/action';
import { IMessage } from 'src/events/models/message';
import { IUser } from 'src/events/models/user';
import { EventsService } from 'src/events/events.service';
import { StorageService } from 'src/storage/storage.service';
import { ChatService } from '../../chat.service';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { DialogUserType } from '../dialog-user/models/dialog-user-type';
import { IDialogConfigData } from '../dialog-user/models/dialog-config-data';
import { IDialogResultParams } from '../dialog-user/models/dialog-result-params';
import { UniversalService } from 'src/universal/universal.service';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private static userIdStorageKey = 'userid';
  @ViewChild(MatList, { read: ElementRef }) public matList: ElementRef;
  @ViewChildren(MatListItem, { read: ElementRef }) public matListItems: QueryList<MatListItem>;

  public user: IUser;
  public messageContent: string;
  public ioConnection: any;
  public dialogRef: MatDialogRef<DialogUserComponent, IDialogResultParams> | null;

  public action = Action;
  public messages: IMessage[] = [];
  public defaultDialogUserParams: MatDialogConfig<IDialogConfigData> = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  private destroy$ = new Subject<void>();
  private socketConnected$ = new BehaviorSubject<boolean>(false);
  private messageCreation$ = new Subject<IMessage>();

  constructor(private eventsService: EventsService,
              private chatService: ChatService,
              private storageService: StorageService,
              private universalService: UniversalService,
              public dialog: MatDialog) {}

  public ngOnInit(): void {
    if (!this.universalService.isInBrowser) {
      return;
    }

    this.initModel();
    this.subscribeToMessageCreation();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(_elements => {
        this.scrollToBottom();
      });
  }

  public subscribeToMessageCreation() {
    this.messageCreation$
      .pipe(
        switchMap(message => this.chatService.sendMessage(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.messageCreation$.next({
      from: this.user,
      content: message
    });

    this.messageContent = null;
  }

  public sendNotification(action: Action, previousName?: string): void {
    let message: IMessage;

    switch(action) {
      case Action.JOINED:
        message = {
          from: this.user,
          action
        };
        break;

      case Action.RENAME:
        message = {
          action,
          from: this.user,
          previousName
        };
        break;
    }

    this.messageCreation$.next(message);
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    const uid = this.storageService.getItem(ChatComponent.userIdStorageKey);

    if (uid) {
      this.chatService.getUserDetails(uid)
        .pipe(
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe(user => {
          if (!user) {
            this.createNewUser();
          } else {
            this.user = user;
            this.onJoin();
          }

        });
    } else {
      this.createNewUser();
    }
  }

  private createNewUser() {
    const uid = uuid1();

    this.storageService.setItem(ChatComponent.userIdStorageKey, uid);

    this.user = {
      uid,
      avatar: `${AVATAR_URL}/${uid}.png`
    };

    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);
  }

  private initIoConnection(): void {
    this.eventsService.initSocket();

    this.ioConnection = this.eventsService.onMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: IMessage) => {
        console.log(message);
        this.messages.push(message);
      });

    this.eventsService.onConnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(socketId => {
        this.user.socketId = socketId;
        this.socketConnected$.next(true);
        console.log('connected');
      });

    this.eventsService.onDisconnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.socketConnected$.next(false);
        console.log('disconnected');
      });

    this.eventsService.onGiveMeUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.eventsService.sendSocketIdUpdate(this.user);
      });
  }

  private openUserPopup(params: MatDialogConfig<IDialogConfigData>): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);

    this.dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(paramsDialog => this.onDialogClose(paramsDialog));
  }

  private onDialogClose(paramsDialog: IDialogResultParams) {
    if (!paramsDialog) {
      return;
    }

    this.user.name = paramsDialog.username;

    switch (paramsDialog.dialogType) {
      case DialogUserType.NEW:
        this.onJoin();
        return;

      case DialogUserType.EDIT:
        this.sendNotification(Action.RENAME, paramsDialog.previousUsername);
        return;
    }
  }

  private onJoin() {
    const socketIsConnected$ = this.socketConnected$
      .pipe(filter(connected => connected));

    this.initIoConnection();

    zip(this.chatService.getAllMessages(), socketIsConnected$)
      .pipe(
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(([messages]) => {
        this.messages = messages;

        this.sendNotification(Action.JOINED);
      });
  }
}
