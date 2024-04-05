import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './room/room.module';
import { MONGO_CONNECT_LOCAL } from './db/mongo';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_CONNECT || MONGO_CONNECT_LOCAL,
      }),
    }),
    GatewayModule,
    RoomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
