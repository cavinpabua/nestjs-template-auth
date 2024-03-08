import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserPipe } from '@/internal/common/pipes/user.pipe';
import { WalletService } from '@/wallet/wallet.service';
import { UsersDocument } from '@/users/schemas/users.schema';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { CreateWalletDto } from '@/wallet/dto/create-wallet.dto';
import { IsApiKeyOnly } from '@/internal/common/decorators/api-key-only.decorator';
import { TopupWalletDto } from '@/wallet/dto/topup-wallet.dto';

@ApiTags('wallet')
@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @ApiBody({ type: CreateWalletDto })
  @UsePipes(ValidationTransformPipe)
  @Post('create-wallet')
  create(@Body() dto: CreateWalletDto) {
    return this.service.create(dto);
  }

  @ApiBody({ type: TopupWalletDto })
  @IsApiKeyOnly()
  @UsePipes(ValidationTransformPipe)
  @Post('direct-topup')
  topUp(@Body() dto: TopupWalletDto) {
    return this.service.topUp(dto);
  }

  @UsePipes(ValidationTransformPipe)
  @Get()
  getWallet(@Param(UserPipe) user: UsersDocument) {
    const wallet = this.service.getWallet(user.id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }
}
