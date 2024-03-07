import { Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UsersRepository } from '@/users/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '@/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
