import { ApiProperty } from '@nestjs/swagger';
import { SchemaId } from '@/internal/types/helpers';

export class BaseDto {
  @ApiProperty()
  readonly id: string | SchemaId;
}
