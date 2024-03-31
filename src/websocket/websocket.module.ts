import { Module } from '@nestjs/common';
import { WebsocketGetway } from './websocket.getway';
import { RoomModule } from '../room/room.module';

@Module({
  providers: [WebsocketGetway],
  imports: [RoomModule],
})
export class GatewayModule {}
