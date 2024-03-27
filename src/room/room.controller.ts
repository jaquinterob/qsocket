import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto, UpdateRoomDto } from './dto/room.dto';

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

  @Patch('/:hash')
  update(@Param('hash') hash: string, @Body() roomDto: UpdateRoomDto) {
    return this.roomService.update(hash, roomDto);
  }

  @Patch('addUserToRoom/:hash/:newUser')
  addUserToRoom(
    @Param('hash') hash: string,
    @Param('newUser') newUser: string,
  ) {
    return this.roomService.addUserToRoom(newUser, hash);
  }
}
