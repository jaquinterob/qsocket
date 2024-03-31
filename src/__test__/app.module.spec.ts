import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { GatewayModule } from '../websocket/websocket.module';
import { RoomModule } from '../room/room.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule,GatewayModule,RoomModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should import GatewayModule', () => {
    const gatewayModule = app.get(GatewayModule);
    expect(gatewayModule).toBeDefined();
  });


  it('should import RoomModule', () => {
    const roomModule = app.get(RoomModule);
    expect(roomModule).toBeDefined();
  });
});