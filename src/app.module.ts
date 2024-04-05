import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './room/room.module';
import { mongoUrl } from './database/mongo-connection';
import { RoomService } from './room/room.service';

@Module({
  imports: [
    GatewayModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_CONNECT,
      }),
    }),
    RoomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
