import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '@/auth/domain/types';
import { Gender } from '@/users/domain/types';

@Schema({
  timestamps: true,
  collection: 'fa__users',
  optimisticConcurrency: true,
})
export class Users {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false })
  firstName?: string;

  @Prop({ type: String, required: false })
  lastName?: string;

  @Prop({ type: Number, required: false })
  age?: number;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, default: Role.USER })
  role: Role;

  @Prop({ type: String, required: false })
  gender?: Gender;
}

export type UsersDocument = HydratedDocument<Users>;
export const UsersSchema = SchemaFactory.createForClass(Users);
