import { IsNotEmpty, IsString, Length } from 'class-validator';


export class RoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(40, 40)
  hash: string;
}
