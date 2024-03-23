import { Module } from '@nestjs/common';
import { WebsocketGetway } from './websocket.getway';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';

@Module({
  providers: [WebsocketGetway],
  imports: [RoomModule],
})
export class GatewayModule {}
