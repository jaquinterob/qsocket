import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './room/room.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_CONNECT,
      }),
    }),
    GatewayModule,
    RoomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
