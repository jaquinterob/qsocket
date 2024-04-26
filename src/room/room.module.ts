import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, roomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: roomSchema,
      },
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
