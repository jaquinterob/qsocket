import { RoomService } from "../../room/room.service";
import { WebsocketGetway } from "../websocket.getway";
import { Test, TestingModule } from "@nestjs/testing";

describe('WebsocketGateway', () => {
  let gateway: WebsocketGetway;
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketGetway,
        {
          provide: RoomService,
          useValue: {
            // Mockear los métodos necesarios de RoomService
            addUserToRoom: jest.fn(),
            setLastVotes: jest.fn(),
            setShowBy: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<WebsocketGetway>(WebsocketGetway);
    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  // Prueba para el manejo de la conexión de un cliente
  describe('handleConnection', () => {
    it('should join the default room if no room specified', () => {
      const client = { handshake: { query: {} }, join: jest.fn(), emit: jest.fn() };
      gateway.handleConnection(client as any);
      expect(client.join).toHaveBeenCalledWith('default');
    });

    // Aquí puedes agregar más pruebas para el manejo de la conexión según tus necesidades
  });

  // Prueba para el manejo de la desconexión de un cliente
  describe('handleDisconnect', () => {
    it('should leave all rooms on disconnect', () => {
      const client = { rooms: ['room1', 'room2'], leave: jest.fn() };
      gateway.handleDisconnect(client as any);
      expect(client.leave).toHaveBeenCalledTimes(2);
      expect(client.leave).toHaveBeenCalledWith('room1');
      expect(client.leave).toHaveBeenCalledWith('room2');
    });

    // Aquí puedes agregar más pruebas para el manejo de la desconexión según tus necesidades
  });

  // Aquí puedes agregar más pruebas para los métodos restantes de la clase según tus necesidades
});