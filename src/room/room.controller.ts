import { Controller, Post, Body, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Post()
  create(@Body() roomDto: RoomDto) {
    return this.roomService.create(roomDto);
  }
}
