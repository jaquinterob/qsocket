import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './errors/AllExceptionsFilter';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    GatewayModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
