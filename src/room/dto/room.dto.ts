import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Vote } from 'src/websocket/interfaces/vote';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(40, 40)
  hash: string;
  users: string[];
  lastVotes: Vote[];
  showBy: string;
}

export class UpdateRoomDto extends PartialType(RoomDto) {}
