import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventsService } from '../events/events.service';
import { IUser } from './models/user';
import { UserSchemaName } from './schemas/user.schema';
import { IUserModel } from './models/user-model';

@Injectable()
export class UserService {
  constructor(private eventsService: EventsService,
              @InjectModel(UserSchemaName) private readonly userModel: Model<IUserModel>,) {
    this.subscribeToConnect();
    this.subscribeToSocketIdUpdate();
  }

  public async getUserDetails(uid: string): Promise<IUser> {
    const user = await this.userModel.findOne({ uid }).exec();

    return user ? {
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      socketId: user.socketId
    } : null;
  }

  public async updateSocketId(user: IUser) {
    const existingUser = await this.userModel.findOne({ uid: user.uid }).exec();

    if (existingUser) {
      existingUser.socketId = user.socketId;

      await existingUser.save();
    } else {
      const newUser = new this.userModel(user);

      await newUser.save();
    }
  }

  public async updateName(user: IUser) {
    const existingUser = await this.userModel.findOne({ uid: user.uid }).exec();

    if (!existingUser) {
      return;
    }

    existingUser.name = user.name;

    await existingUser.save();
  }

  public async getBySocketId(socketId: string): Promise<IUserModel> {
    return await this.userModel.findOne({ socketId }).exec();
  }

  private subscribeToConnect() {
    this.eventsService.connect$
      .subscribe(async socketId => {
        const user = this.getBySocketId(socketId);

        if (!user) {
          this.eventsService.giveMeUser(socketId);
        }
      });
  }

  private subscribeToSocketIdUpdate() {
    this.eventsService.socketIdUpdate$
      .subscribe(async user => {
        this.updateSocketId(user);
      });
  }
}
