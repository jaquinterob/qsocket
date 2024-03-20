import { Controller, Post, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';


@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() roomDto: RoomDto) {
    return this.roomService.create(roomDto);
  }
}
