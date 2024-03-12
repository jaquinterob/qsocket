import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';

@Module({
  imports: [GatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
