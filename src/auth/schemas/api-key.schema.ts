import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'fa__api_keys',
})
export class ApiKey {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: Boolean, required: true, default: true })
  isValid: boolean;
}

export type ApiKeyDocument = HydratedDocument<ApiKey>;
export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
