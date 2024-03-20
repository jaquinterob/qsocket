import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}
  create(roomDto: RoomDto) {
    const newRoom = new this.roomModel(roomDto);
    return newRoom.save();
  }
}
