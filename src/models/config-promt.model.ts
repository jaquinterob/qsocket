import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigPromtDocument = ConfigPromt & Document;

@Schema()
export class ConfigPromt {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  host: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ConfigPromtSchema = SchemaFactory.createForClass(ConfigPromt);
