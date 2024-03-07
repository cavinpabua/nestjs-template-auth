import { Injectable } from '@nestjs/common';
import { Users, UsersDocument } from '@/users/schemas/users.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends GenericRepository<UsersDocument> {
  constructor(
    @InjectModel(Users.name)
    protected readonly model: Model<UsersDocument>,
  ) {
    super(model);
  }
}
