import {
  Inject,
  Injectable,
  NotFoundException,
  HttpException,
  PipeTransform,
  Scope,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { UsersService } from '@/users/users.service';
import { SchemaId } from '@/internal/types/helpers';
import { UsersDocument } from '@/users/schemas/users.schema';

@Injectable({ scope: Scope.REQUEST })
export class UserPipe implements PipeTransform {
  constructor(
    private readonly service: UsersService,
    @Inject(REQUEST) private readonly request,
  ) {}

  async transform(): Promise<UsersDocument> {
    const user = this.request.user ?? this.request.body.user;
    const id = <SchemaId>user?._id;

    if (!id)
      throw new HttpException('User id not found', HttpStatus.UNAUTHORIZED);

    const customer = await this.service.findById(id);
    if (!customer) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return customer;
  }
}
