import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '@/wallet/schemas/wallet.schema';
import { WalletService } from '@/wallet/wallet.service';
import { WalletRepository } from '@/wallet/repositories/wallet.repository';
import { WalletController } from '@/wallet/wallet.controller';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    UsersModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletService, WalletRepository],
})
export class WalletModule {}
