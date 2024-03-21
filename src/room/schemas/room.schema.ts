import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Room {
  @Prop({ unique: true, required: true, trim: true })
  hash: string;
  @Prop({ default: [] })
  users: string[];
}

export const roomSchema = SchemaFactory.createForClass(Room);
