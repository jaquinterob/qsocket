import { Test, TestingModule } from '@nestjs/testing';

import { WebsocketGetway } from '../websocket.getway';
import { GatewayModule } from '../websocket.module';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';

describe('GatewayModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [GatewayModule, RoomModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have WebsocketGetway provider', () => {
    const websocketGateway = module.get<WebsocketGetway>(WebsocketGetway);
    expect(websocketGateway).toBeDefined();
  });
});
