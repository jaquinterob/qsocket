import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../room.service';
import { Room } from '../schemas/room.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomServiceMocks } from './mocks';

describe('RoomService', () => {
  let service: RoomService;
  let roomModel: Model<Room>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getModelToken(Room.name),
          useValue: RoomServiceMocks.roomModel,
        },
      ],
    }).compile();
    service = module.get<RoomService>(RoomService);

    roomModel = module.get<Model<Room>>(getModelToken(Room.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all rooms', async () => {
      jest.spyOn(roomModel, 'find' as any).mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([]),
      });
      const result = await service.findAll();
      expect(result.length).toEqual(0);
    });
  });

  it('create() works', async () => {
    const createSpy = jest.spyOn(roomModel, 'create');
    const result = await service.create(RoomServiceMocks.roomDto);
    expect(createSpy).toHaveBeenCalledWith(RoomServiceMocks.roomDto);
    expect(result.showBy).toBe('test');
  });

  it('should async update(hash: string, roomDto: UpdateRoomDto): Promise<RoomDto> works', async () => {
    const findOneSpy = jest.spyOn(roomModel, 'findOne');
    const result = await service.update('', RoomServiceMocks.roomDto);
    expect(findOneSpy).toHaveBeenCalledWith({ hash: '' });
    expect(result.users).toEqual([]);
  });

  it('should async addUserToRoom(newUser: string, hash: string) works', async () => {
    const existUserSpy = jest
      .spyOn(service, 'existUser' as any)
      .mockReturnValue(false);
    const result = await service.addUserToRoom('', '');
    expect(RoomServiceMocks.roomModel.findOne).toHaveBeenCalledWith({ hash: '' });
    expect(existUserSpy).toHaveBeenCalledWith('', []);
    expect(result).toEqual(RoomServiceMocks.roomDto);
  });

  it('should async setLastVotes(votes: Vote[], hash: string) works', async () => {
    const result = await service.setLastVotes(RoomServiceMocks.votes, '');
    expect(RoomServiceMocks.roomModel.findOne).toHaveBeenCalledWith({ hash: '' });
    expect(result).toEqual(RoomServiceMocks.roomDto);
  });

  it('should async setShowBy(user: string, hash: string) works', async () => {
    const result = await service.setShowBy('', '');
    expect(RoomServiceMocks.roomModel.findOne).toHaveBeenCalledWith({ hash: '' });
    expect(result).toEqual(RoomServiceMocks.roomDto);
  });

  describe('existUser(newUser: string, users: string[]) works', () => {
    it('should return true when exist new user', () => {
      expect(service['existUser']('test', ['test'])).toBe(true);
    });
    it('should return false when user does not exist', () => {
      expect(service['existUser']('test', [''])).toBe(false);
    });
  });
});
