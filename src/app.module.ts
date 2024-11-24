import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './errors/AllExceptionsFilter';

@Module({
  imports: [GatewayModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
