import { RoomDto } from '../dto/room.dto';
import { Vote } from '../../websocket/interfaces/vote';

// eslint-disable-next-line @typescript-eslint/no-namespace
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
      catch: jest.fn().mockRejectedValueOnce({}),
    }),
    findOne: jest.fn(() => ({
      save: jest.fn().mockResolvedValueOnce(roomDto),
      catch: jest.fn().mockResolvedValueOnce(roomDto),
      users: [],
    })),
    findOneAndUpdate: jest.fn().mockResolvedValueOnce(roomDto),
    create: jest.fn().mockResolvedValueOnce({
      save: jest.fn().mockResolvedValueOnce(roomDto),
    }),
  };
}
