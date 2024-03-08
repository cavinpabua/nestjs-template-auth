import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Gender } from '@/users/domain/types';
import { Role } from '@/auth/domain/types';
import { Transform, TransformFnParams } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export function hashPassword(params: TransformFnParams): string {
  const password = params.value;

  if (password < 8) {
    throw new HttpException(
      'Password must be at least 8 characters long',
      HttpStatus.BAD_REQUEST,
    );
  }
  return bcrypt.hashSync(password, 10);
}

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
  @IsEnum(Role)
  role?: Role;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;

  @ApiProperty()
  @IsString()
  @Transform(hashPassword)
  password: string;
}
