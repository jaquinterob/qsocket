import { Module } from '@nestjs/common';
import { websocketGetway } from './websocket.getway';

@Module({
  providers: [websocketGetway],
})
export class GatewayModule {}
