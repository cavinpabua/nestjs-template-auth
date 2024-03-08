import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey, ApiKeyDocument } from '@/auth/schemas/api-key.schema';

@Injectable()
export class ApiKeyRepository extends GenericRepository<ApiKeyDocument> {
  constructor(
    @InjectModel(ApiKey.name)
    protected readonly model: Model<ApiKeyDocument>,
  ) {
    super(model);
  }
}
