import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';

@Schema({
  timestamps: true,
  collection: 'fa__wallet',
  optimisticConcurrency: true,
})
export class Wallet {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: SchemaId;

  @Prop({ type: Number, required: true, default: 0 })
  balance: number;

  @Prop({ type: String, required: false, default: 'PHP' })
  currency: string;
}

export type WalletDocument = HydratedDocument<Wallet>;
export const WalletSchema = SchemaFactory.createForClass(Wallet);
