import { DeepRequired } from "@vine-kit/core";

import { IEntity, IPageParams, IPaginationResponse, IRepository, IRepositoryOptions, CreateReq, CreateManyReq, DeleteReq, DeleteManyReq, InfoReq, PageReq, ListReq, UpdateReq, UpdateManyReq } from "../interface";

export abstract class AbstractRepository<T extends IEntity> implements IRepository<T> {
  protected options: IRepositoryOptions

  constructor(options?: IRepositoryOptions) {
    const defaultOptions: IRepositoryOptions = {
      name: this.constructor.name,
      description: '',
      version: '0.0.0',
      type: 'unknown'
    }

    this.options = { ...defaultOptions, ...options }
  }

  abstract create(data: CreateReq<T>): Promise<T>
  abstract createMany(data: CreateManyReq<T>): Promise<T[]>
  abstract delete(data: DeleteReq<T>): Promise<void>
  abstract deleteMany(data: DeleteManyReq<T>): Promise<void>
  abstract update(data: UpdateReq<T>): Promise<T>
  abstract updateMany(data: UpdateManyReq<T>): Promise<T[]>
  abstract page(data?: PageReq<T>): Promise<IPaginationResponse<T>>
  abstract list(data?: ListReq<T>): Promise<T[]>
  abstract info(data: InfoReq<T>): Promise<T | null>

  protected buildPageParams(data?: PageReq<T>): DeepRequired<IPageParams> {
    const { pagination = { page: 1, size: 10 }, where = {}, order = {}, fields = [] } = data || {}

    return {
      fields,
      where,
      order,
      pagination
    }
  }
}
