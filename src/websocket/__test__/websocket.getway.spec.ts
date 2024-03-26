import { RoomService } from 'src/room/room.service';
import { WebsocketGetway } from '../websocket.getway';
import { Test } from '@nestjs/testing';
import { GatewayModule } from '../websocket.module';
import { RoomModule } from 'src/room/room.module';

xdescribe('WebsocketGateway', () => {
  let websocketGateway
  const room = {
    name: 'room1',
    history: [{ user: 'John', value: 3 }],
    show: false,
  };
  beforeEach(async() => {
    websocketGateway = new WebsocketGetway();
    
    websocketGateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
  });

  describe('handleConnection', () => {
    it('should handle connection properly', () => {
      const client = {
        handshake: { query: { room: 'mockRoom' } },
        join: jest.fn(),
        emit: jest.fn(),
      };
      websocketGateway.handleConnection(client);
      expect(websocketGateway.rooms.length).toEqual(1);
      expect(websocketGateway.rooms[0].name).toEqual('mockRoom');
      expect(client.join).toHaveBeenCalledWith('mockRoom');
      expect(client.emit).toHaveBeenCalledWith('roomHistory', []);
      expect(client.emit).toHaveBeenCalledWith('show', false);
    });
  });

  describe('handleDisconnect', () => {
    it('should handle disconnection properly', () => {
      const client = { rooms: ['room1', 'room2'], leave: jest.fn() };
      websocketGateway.handleDisconnect(client);
      expect(client.leave).toHaveBeenCalledWith('room1');
      expect(client.leave).toHaveBeenCalledWith('room2');
    });
  });

  describe('registerUser', () => {
    it('should register a user in the room history', () => {
      const existsUserSpy = jest.spyOn(websocketGateway, 'existsUser' as any);
      const payload = [{ user: 'John', value: 5 }, 'room1'];
      websocketGateway.rooms.push({ name: 'room1', history: [], show: false });
      websocketGateway.registerUser([{ user: 'John', value: 5 }, 'room1']);
      expect(existsUserSpy).toHaveBeenCalled();
    });

    it('should return false if user already exists in the room history', () => {
      const getRoomSpy = jest.spyOn(websocketGateway, 'getRoom');
      websocketGateway.rooms.push(room);
      websocketGateway.registerUser([{ user: 'John', value: 5 }, 'room1']);
      expect(getRoomSpy).toHaveBeenCalled();
    });
  });

  describe('handleMessage works ', () => {
    it('should save when user !="" and does not exist', () => {
      const addNewVoteSpy = jest.spyOn(websocketGateway, 'addNewVote' as any);
      websocketGateway.rooms.push(room);
      websocketGateway.handleMessage([{ user: 'Juan', value: 5 }, 'room1']);
      expect(addNewVoteSpy).toHaveBeenCalled();
    });

    it('should return null when user is empty', () => {
      websocketGateway.rooms.push(room);
      const result = websocketGateway.handleMessage([
        { user: '', value: 5 },
        'room1',
      ]);
      expect(result).toBeFalsy();
    });
    it('should update the user when the user already exists', () => {
      const updateVoteSpy = jest.spyOn(websocketGateway, 'updateVote' as any);
      websocketGateway.rooms.push(room);
      websocketGateway.handleMessage([{ user: 'John', value: 5 }, 'room1']);
      expect(updateVoteSpy).toHaveBeenCalled();
    });
  });

  it('should logOut(@MessageBody() payload: any) works', () => {
    const toSpy = jest.spyOn(websocketGateway.server, 'to');
    websocketGateway.rooms.push(room);
    websocketGateway.logOut([{ user: 'John', value: 5 }, 'room1']);
    expect(toSpy).toHaveBeenCalled();
  });

  it('should showVotes(@MessageBody() payload: any) works', () => {
    const toSpy = jest.spyOn(websocketGateway.server, 'to');
    websocketGateway.rooms.push(room);
    websocketGateway.showVotes(['room1', true]);
    expect(toSpy).toHaveBeenCalled();
    websocketGateway.showVotes(['room1', false]);
    expect(toSpy).toHaveBeenCalled();
  });

  it('should resetVotes(@MessageBody() roomName: string) works', () => {
    const resetAllVotesSpy = jest.spyOn(
      websocketGateway,
      'resetAllVotes' as any,
    );
    websocketGateway.rooms.push(room);
    websocketGateway.resetVotes('room1');
    expect(resetAllVotesSpy).toHaveBeenCalled();
  });

  it('should resetValue(@MessageBody() roomName: string) works', () => {
    const toSpy = jest.spyOn(websocketGateway.server, 'to');
    websocketGateway.rooms.push(room);
    websocketGateway.resetValue('room1');
    expect(toSpy).toHaveBeenCalled();
  });
});
