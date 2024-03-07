import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersRepository } from '@/users/repositories/users.repository';
import { SchemaId } from '@/internal/types/helpers';
import { UsersDocument } from '@/users/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(createSurvivorDto: CreateUserDto): Promise<UsersDocument> {
    const user = await this.repository.first({
      email: createSurvivorDto.email,
    });

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    return await this.repository.store(createSurvivorDto);
  }

  async findByEmailAndGetPassword(email: string) {
    return await this.repository.first({
      select: ['id', 'password', 'role'],
      email,
    });
  }

  async findById(userId: SchemaId) {
    return await this.repository.findById(userId);
  }

  async update(id: SchemaId, dto: UpdateUserDto) {
    const user = await this.repository.update(id, dto);
    if (!user) {
      throw new NotFoundException(`Survivor with id ${id} does not exist`);
    }
    return user;
  }

  async updatePassword(id: SchemaId, oldPassword: string, password: string) {
    const current = await this.repository.first(id);
    const isMatch = await bcrypt.compare(oldPassword, current.password);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    const user = await this.repository.update(id, {
      password: await bcrypt.hash(password, 10),
    });
    if (!user) {
      throw new NotFoundException(`Survivor with id ${id} does not exist`);
    }
    delete user.password;
    return user;
  }

  async delete(id: SchemaId) {
    const user = await this.repository.first(id);

    if (!user) {
      throw new NotFoundException(`Survivor with id ${id} does not exist`);
    }

    return this.repository.delete(id);
  }
}
