import { Controller, Get, Param } from '@nestjs/common';
import { IUser } from './models/user';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/user/:uid')
  async getUserDetails(@Param('uid') uid): Promise<IUser> {
    return await this.userService.getUserDetails(uid);
  }
}
