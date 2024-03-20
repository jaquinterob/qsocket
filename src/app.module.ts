import { Module } from '@nestjs/common';
import { GatewayModule } from './websocket/websocket.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [GatewayModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb://jaquinterob:matrimonio@mongo.jaquinterob.com:27777/qpocker?authSource=admin`,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
