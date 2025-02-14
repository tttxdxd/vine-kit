import { IEntity, IPaginationResponse, IRepository, CreateReq, CreateManyReq, DeleteReq, DeleteManyReq, InfoReq, PageReq, ListReq, UpdateReq, UpdateManyReq } from "../interface";

export abstract class AbstractService<T extends IEntity> implements IRepository<T> {
  protected abstract repository: IRepository<T>

  async create(data: CreateReq<T>): Promise<T> {
    return this.repository.create(data)
  }

  async createMany(data: CreateManyReq<T>): Promise<T[]> {
    return this.repository.createMany(data)
  }

  async delete(data: DeleteReq<T>): Promise<void> {
    return this.repository.delete(data)
  }

  async deleteMany(data: DeleteManyReq<T>): Promise<void> {
    return this.repository.deleteMany(data)
  }

  async update(data: UpdateReq<T>): Promise<T> {
    return this.repository.update(data)
  }

  async updateMany(data: UpdateManyReq<T>): Promise<T[]> {
    return this.repository.updateMany(data)
  }

  async page(data?: PageReq<T>): Promise<IPaginationResponse<T>> {
    return this.repository.page(data)
  }

  async list(data?: ListReq<T>): Promise<T[]> {
    return this.repository.list(data)
  }

  async info(data: InfoReq<T>): Promise<T | null> {
    return this.repository.info(data)
  }
} 
