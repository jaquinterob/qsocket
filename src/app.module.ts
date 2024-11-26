import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './errors/AllExceptionsFilter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), GatewayModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
