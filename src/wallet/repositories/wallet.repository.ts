import { Injectable } from '@nestjs/common';
import { Wallet, WalletDocument } from '@/wallet/schemas/wallet.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WalletRepository extends GenericRepository<WalletDocument> {
  constructor(
    @InjectModel(Wallet.name)
    protected readonly model: Model<WalletDocument>,
  ) {
    super(model);
  }
}
