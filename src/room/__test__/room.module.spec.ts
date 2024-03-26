import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from '../room.module';
import { RoomController } from '../room.controller';
import { RoomService } from '../room.service';
import { Room, roomSchema } from '../schemas/room.schema';

describe('RoomModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(`mongodb://jaquinterob:matrimonio@mongo.jaquinterob.com:27777/qpocker?authSource=admin`), // Provide your MongoDB connection string
        MongooseModule.forFeature([
          {
            name: Room.name,
            schema: roomSchema,
          },
        ]),
        RoomModule,
      ],
      controllers: [RoomController],
      providers: [RoomService],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have RoomController', () => {
    const controller = module.get<RoomController>(RoomController);
    expect(controller).toBeDefined();
  });

  it('should have RoomService', () => {
    const service = module.get<RoomService>(RoomService);
    expect(service).toBeDefined();
  });
});