
export interface IRepositoryOptions {
  name: string
  description?: string
  version?: string

  type: 'unknown' | 'memory' | 'database' | 'api'
}

export interface IPaginationParams {
  page: number
  size: number
}

export interface IPaginationResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
}

export interface IPageParams {
  pagination?: IPaginationParams
  where?: Record<string, any>
  order?: Record<string, 'ASC' | 'DESC'>
  fields?: string[]
}

export type IEntity<T extends {} = {}> = {
  id: string | number
  createTime: string
  updateTime: string
} & T

export type CreateReq<T extends IEntity> = Omit<T, 'id'>
export type CreateManyReq<T extends IEntity> = CreateReq<T>[]
export type UpdateReq<T extends IEntity> = Partial<T> & Pick<T, 'id'>
export type UpdateManyReq<T extends IEntity> = UpdateReq<T>[]
export type DeleteReq<T extends IEntity> = Pick<T, 'id'>
export type DeleteManyReq<T extends IEntity> = DeleteReq<T>[]
export type InfoReq<T extends IEntity> = Pick<T, 'id'>
export type PageReq<T extends IEntity> = IPageParams
export type ListReq<T extends IEntity> = IPageParams

export interface IRepository<T extends IEntity> {
  create(data: CreateReq<T>): Promise<T>
  createMany(data: CreateManyReq<T>): Promise<T[]>
  delete(data: DeleteReq<T>): Promise<void>
  deleteMany(data: DeleteManyReq<T>): Promise<void>
  update(data: UpdateReq<T>): Promise<T>
  updateMany(data: UpdateManyReq<T>): Promise<T[]>
  page(data?: PageReq<T>): Promise<IPaginationResponse<T>>
  list(data?: ListReq<T>): Promise<T[]>
  info(data: InfoReq<T>): Promise<T | null>
}
