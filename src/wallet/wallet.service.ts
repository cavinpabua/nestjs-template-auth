import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletRepository } from '@/wallet/repositories/wallet.repository';
import { SchemaId } from '@/internal/types/helpers';
import { CreateWalletDto } from '@/wallet/dto/create-wallet.dto';
import { Wallet } from '@/wallet/schemas/wallet.schema';
import { TopupWalletDto } from '@/wallet/dto/topup-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly repository: WalletRepository) {}

  async create(dto: CreateWalletDto): Promise<Wallet> {
    const exist = await this.repository.first({ userId: dto.userId });
    if (exist) {
      throw new HttpException('Wallet already exists', HttpStatus.BAD_REQUEST);
    }
    return this.repository.store(dto);
  }

  async getWallet(userId: SchemaId) {
    const wallet = await this.repository.first({
      userId,
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async topUp(dto: TopupWalletDto) {
    const wallet = await this.repository.findById(dto.walletId);
    wallet.balance += dto.amount;
    // TODO update transactions collection -- indicate this is direct topup from device
    return this.repository.update(dto.walletId, wallet);
  }
}
