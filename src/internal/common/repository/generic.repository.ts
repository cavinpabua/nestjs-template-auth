import { RepositoryContract } from '@/internal/common/repository/repository.contract';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { Projection } from '@/internal/common/repository/types';
import { SchemaId } from '@/internal/types/helpers';

export abstract class GenericRepository<ModelDocument>
  implements RepositoryContract<ModelDocument>
{
  protected constructor(protected readonly model: Model<ModelDocument>) {}

  async delete(id: Types.ObjectId): Promise<ModelDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findAll(
    query: FilterQuery<ModelDocument>,
    options: QueryOptions = { sort: { credits: 'asc' } },
    projection?: Projection<ModelDocument>,
  ): Promise<Array<ModelDocument>> {
    return this.model.find(query, projection, options).exec();
  }

  async findAllPaginated(
    query?: FilterQuery<ModelDocument>,
    options: QueryOptions = {
      skip: 0,
      limit: 10,
      lean: true,
    },
    projection?: Projection<ModelDocument>,
  ): Promise<PaginatorSchematicsInterface<ModelDocument>> {
    const total = await this.model.countDocuments(query).exec();
    const data = await this.model.find(query, projection, options).exec();
    return PaginatorSchema.build<ModelDocument>(
      total,
      data,
      options.skip ?? 0,
      options.limit ?? 10,
    );
  }

  async findById(id: SchemaId, options?: QueryOptions): Promise<ModelDocument> {
    return this.model.findById(id, {}, options).exec();
  }

  async store<DTO>(data: DTO): Promise<ModelDocument> {
    return this.model.create(data);
  }

  async first(query: FilterQuery<ModelDocument>): Promise<ModelDocument> {
    return this.model.findOne(query).exec();
  }

  async update<DTO>(
    id: SchemaId,
    data: UpdateQuery<DTO>,
  ): Promise<ModelDocument> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async count(filter: FilterQuery<ModelDocument>): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
