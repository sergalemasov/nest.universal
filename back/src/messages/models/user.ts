import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  uid: string;

  @IsString()
  avatar: string;

  @IsString()
  name: string;

  @IsString()
  socketId: string;
}
