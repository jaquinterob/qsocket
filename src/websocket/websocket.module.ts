import { Module } from '@nestjs/common';
import { WebsocketGetway } from './websocket.getway';

@Module({
  providers: [WebsocketGetway],
  imports: [],
})
export class GatewayModule {}
