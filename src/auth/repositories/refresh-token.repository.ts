import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshTokensDocument,
  RefreshTokens,
} from '@/auth/schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository extends GenericRepository<RefreshTokensDocument> {
  constructor(
    @InjectModel(RefreshTokens.name)
    protected readonly model: Model<RefreshTokensDocument>,
  ) {
    super(model);
  }
}
