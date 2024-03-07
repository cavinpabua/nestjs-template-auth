import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Gender } from '@/users/domain/types';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly age?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
