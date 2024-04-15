import { RoomService } from '../../room/room.service';
import { WebsocketGetway } from '../websocket.getway';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { GatewayMock } from './mocks';

describe('WebsocketGateway', () => {
  let gateway: WebsocketGetway;

  let getRoomSpy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketGetway,
        {
          provide: RoomService,
          useValue: GatewayMock.roomService,
        },
      ],
    }).compile();

    gateway = module.get<WebsocketGetway>(WebsocketGetway);
    gateway.server = new Server();
    getRoomSpy = jest
      .spyOn(gateway, 'getRoom' as any)
      .mockReturnValue(GatewayMock.room);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should join the default room if no room specified', () => {
      gateway['rooms'] = [GatewayMock.room];
      const client = {
        handshake: { query: { room: '' } },
        join: jest.fn(),
        emit: jest.fn(),
      };
      gateway.handleConnection(client as any);
      expect(client.join).toHaveBeenCalledWith('default');
    });
  });

  describe('handleDisconnect', () => {
    it('should leave all rooms on disconnect', () => {
      const client = { rooms: ['room1', 'room2'], leave: jest.fn() };
      gateway.handleDisconnect(client as any);
      expect(client.leave).toHaveBeenCalledTimes(2);
      expect(client.leave).toHaveBeenCalledWith('room1');
      expect(client.leave).toHaveBeenCalledWith('room2');
    });
  });

  it('should registerUser(@MessageBody() payload: any) works', () => {
    gateway.registerUser([GatewayMock.vote, 'roomName']);
    expect(getRoomSpy).toHaveBeenCalled();
  });

  describe('should handleMessage(@MessageBody() payload: any) works', () => {
    it('should return when user === ""', () => {
      expect(
        gateway.handleMessage([GatewayMock.vote, 'roomName']),
      ).toBeUndefined();
    });

    it('should getRoom and updateVote', () => {
      jest.spyOn(gateway, 'existsUser' as any).mockReturnValue(true);
      const updateVoteMock = jest
        .spyOn(gateway, 'updateVote' as any)
        .mockReturnValue(undefined);
      GatewayMock.vote.user = 'test';
      gateway.handleMessage([GatewayMock.vote, 'roomName']);
      expect(getRoomSpy).toHaveBeenCalled();
      expect(updateVoteMock).toHaveBeenCalled();
    });

    it('should getRoom and addnewvote', () => {
      jest.spyOn(gateway, 'existsUser' as any).mockReturnValue(false);
      const addNewVoteSpy = jest
        .spyOn(gateway, 'addNewVote' as any)
        .mockReturnValue(undefined);
      GatewayMock.vote.user = 'test';
      gateway.handleMessage([GatewayMock.vote, 'roomName']);
      expect(getRoomSpy).toHaveBeenCalled();
      expect(addNewVoteSpy).toHaveBeenCalled();
    });
  });

  it('should logOut(@MessageBody() payload: any) works', () => {
    GatewayMock.room.history = [GatewayMock.vote];

    gateway.logOut(['userTest', 'roomName']);
    expect(getRoomSpy).toHaveBeenCalledWith('roomName');
    expect(GatewayMock.room.history[0]).toEqual({ user: 'test', value: 0 });
  });

  it('should async showVotes(@MessageBody() payload: any) works', async () => {
    GatewayMock.room.history = [GatewayMock.vote, GatewayMock.vote];

    const result = await gateway.showVotes(['roomname', true, 'userName']);
    expect(getRoomSpy).toHaveBeenCalledWith('roomname');
    expect(result).toBeUndefined();
  });

  it('should resetVotes(@MessageBody() roomName: string) works', () => {
    const resetAllVotesSpy = jest.spyOn(gateway, 'resetAllVotes' as any);
    gateway.resetVotes('roomName');
    expect(getRoomSpy).toHaveBeenCalledWith('roomName');
    expect(resetAllVotesSpy).toHaveBeenCalledWith(GatewayMock.room);
  });

  it('should resetValue(@MessageBody() roomName: string) works', () => {
    expect(gateway.resetValue('roomName')).toBeUndefined();
  });

  it('should private updateVote(room: Room, newVote: Vote) works', () => {
    expect(
      gateway['updateVote'](GatewayMock.room, GatewayMock.vote),
    ).toBeUndefined();
  });

  it('should private addNewVote(room: Room, newVote: Vote) works', () => {
    gateway['addNewVote'](GatewayMock.room, GatewayMock.vote);
    expect(GatewayMock.room.history.length).toBe(3);
  });

  it('should private existsUser(newVote: Vote, roomHistory: Vote[])', () => {
    expect(
      gateway['existsUser'](GatewayMock.vote, GatewayMock.room.history),
    ).toBe(true);
  });

  it('should private getRoom(roomName: string) works', () => {
    jest.restoreAllMocks();
    gateway['rooms'] = [GatewayMock.room, GatewayMock.room];
    expect(gateway['getRoom']('test')).toEqual(GatewayMock.room);
  });
});
