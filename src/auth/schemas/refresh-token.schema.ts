import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'fa__refresh_token',
})
export class RefreshTokens {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Boolean, required: false, default: true })
  isValid?: boolean;
}

export type RefreshTokensDocument = HydratedDocument<RefreshTokens>;
export const RefreshTokensSchema = SchemaFactory.createForClass(RefreshTokens);
