import { UserDto } from './user';
import { Action } from './action';
import { IsString, IsInt, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {
  @ValidateNested()
  @Type(() => UserDto)
  readonly from: UserDto;

  @IsOptional()
  @IsInt()
  readonly action?: Action;

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsString()
  readonly previousName?: string;
}
