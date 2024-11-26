import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGetway } from './websocket.getway';
import { ConfigPromtSchema } from 'src/models/config-promt.model';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  providers: [WebsocketGetway],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'ConfigPromt', schema: ConfigPromtSchema },
    ]),
  ],
})
export class GatewayModule {}
