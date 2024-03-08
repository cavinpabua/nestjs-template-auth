import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SchemaId } from '@/internal/types/helpers';

export class CreateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: SchemaId;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  currency?: string;
}
