import { IEntity, IPageParams, IPaginationResponse, IRepositoryOptions, CreateReq, CreateManyReq, DeleteReq, DeleteManyReq, InfoReq, UpdateReq, UpdateManyReq } from "../interface";
import { AbstractRepository } from "./abstract.repository";

export class MemoryRepository<T extends IEntity> extends AbstractRepository<T> {
  private data: T[] = []
  private idMap = new Map<string | number, T>()

  constructor(options?: IRepositoryOptions) {
    super({ ...options, type: 'memory', name: options?.name || 'memory' })
  }

  async create(data: CreateReq<T>): Promise<T> {
    const newId = await this.generateId()
    const item = { ...data, id: newId } as T
    this.data.push(item)
    this.idMap.set(newId, item)
    return item
  }

  async createMany(data: CreateManyReq<T>): Promise<T[]> {
    return Promise.all(data.map(item => this.create(item)))
  }

  async delete(data: DeleteReq<T>): Promise<void> {
    const item = this.idMap.get(data.id)
    if (!item) {
      throw new Error('Item not found')
    }

    this.data = this.data.filter(item => item.id !== data.id)
    this.idMap.delete(data.id)
  }

  async deleteMany(data: DeleteManyReq<T>): Promise<void> {
    const idsSet = new Set(data.map(item => item.id))
    this.data = this.data.filter(item => !idsSet.has(item.id))
  }

  async update(data: UpdateReq<T>): Promise<T> {
    const item = this.idMap.get(data.id)
    if (!item) {
      throw new Error('Item not found')
    }
    return { ...item, ...data } as T
  }

  async updateMany(data: UpdateManyReq<T>): Promise<T[]> {
    return Promise.all(data.map(item => this.update(item)))
  }

  async page(params?: IPageParams): Promise<IPaginationResponse<T>> {
    const { pagination } = this.buildPageParams(params)
    const { page, size } = pagination
    const offset = (page - 1) * size
    const limit = size
    const list = this.data.slice(offset, offset + limit)
    const total = this.data.length

    return { list, total, page, size }
  }

  async list(params?: IPageParams): Promise<T[]> {
    const { list } = await this.page(params)
    return list
  }

  async info(data: InfoReq<T>): Promise<T | null> {
    return this.idMap.get(data.id) || null
  }

  private _id = 0
  async generateId(): Promise<string> {
    return (this._id++).toString()
  }
}
