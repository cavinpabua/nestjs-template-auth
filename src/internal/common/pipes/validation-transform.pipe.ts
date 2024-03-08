import { ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';

export class ValidationTransformPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      ...options,
      transform: true,
    });
  }
}
