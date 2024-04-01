import { Room } from '../interfaces/room';
import { Vote } from '../interfaces/vote';

export namespace GatewayMock {
  export const room: Room = {
    name: 'test',
    history: [],
    show: false,
    showBy: '',
  };
  export const vote: Vote = {
    user: '',
    value: 0,
  };
  export const roomService={
    addUserToRoom: jest.fn(),
    setLastVotes: jest.fn(),
    setShowBy: jest.fn(),
  }
}
