import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SchemaId } from '@/internal/types/helpers';

export class TopupWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  walletId: SchemaId;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
