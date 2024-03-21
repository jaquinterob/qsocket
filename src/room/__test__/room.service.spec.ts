import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../room.service';
import { Room } from '../schemas/room.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDto } from '../dto/room.dto';

describe('RoomService', () => {
  let service: RoomService;
  let model: Model<any>;

  const mocks = {
    roomModel: jest.fn(() => ({
      find: jest.fn(), 
      create: jest.fn(),
      constructor: jest.fn(),
      save: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getModelToken(Room.name),
          useValue: mocks.roomModel,
        },
      ],
    }).compile();
    service = module.get<RoomService>(RoomService);

    model = module.get<Model<any>>(getModelToken(Room.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('findAll() works', () => {
  //   service.findAll();
  // });
  it('create() works', () => {
    const roomDto: RoomDto = {
      hash: '',
    };
    service.create(roomDto);
  });
});
