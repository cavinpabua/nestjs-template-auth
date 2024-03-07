import { SchemaId } from '@/internal/types/helpers';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface PayloadToken {
  _id: SchemaId;
  role: Role;
}
