import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from '../room.controller';
import { RoomService } from '../room.service';
import { RoomDto } from '../dto/room.dto';

describe('RoomController', () => {
  let controller: RoomController;
  const mocks = {
    roomService: { findAll: jest.fn(), create: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [{ provide: RoomService, useValue: mocks.roomService }],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll works', () => {
    controller.findAll();
    expect(mocks.roomService.findAll).toHaveBeenCalled();
  });

  it('', () => {
    const roomDto: RoomDto = {
      hash: '',
      users: [],
      lastVotes: [],
      showBy: '',
    };
    controller.create(roomDto);
    expect(mocks.roomService.create).toHaveBeenCalled();
  });
});
