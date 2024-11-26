import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGetway } from './websocket.getway';

@Module({
  providers: [WebsocketGetway],
  imports: [ConfigModule.forRoot()],
})
export class GatewayModule {}
