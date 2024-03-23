import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Vote } from 'src/websocket/interfaces/vote';

@Schema({ versionKey: false })
export class Room {
  @Prop({ unique: true, required: true, trim: true })
  hash: string;
  @Prop({ required: true, default: [] })
  users: string[];
  @Prop({ required: true, default: [] })
  lastVotes: Vote[];
  @Prop({ default: '' })
  showBy: string;
}

export const roomSchema = SchemaFactory.createForClass(Room);
