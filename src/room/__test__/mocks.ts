import { RoomDto } from '../dto/room.dto';
import { Vote } from '../../websocket/interfaces/vote';

export namespace RoomServiceMocks {
  export const roomDto: RoomDto = {
    hash: '',
    users: [],
    lastVotes: [],
    showBy: 'test',
  };

  export const vote: Vote = {
    user: 'test',
    value: 1,
  };

  export const votes: Vote[] = [vote];

  export const roomModel = {
    find: jest.fn().mockReturnValueOnce({
      sort: jest.fn().mockResolvedValueOnce([]),
    }),
    findOne: jest.fn(() => ({
      save: jest.fn().mockResolvedValueOnce(roomDto),
      users: [],
    })),
    findOneAndUpdate: jest.fn().mockResolvedValueOnce(roomDto),
    create: jest.fn().mockResolvedValueOnce({
      save: jest.fn().mockResolvedValueOnce(roomDto),
    }),
  };
}
