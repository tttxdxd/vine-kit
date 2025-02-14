import { IEntity } from "../interface";

export abstract class AbstractEntity implements IEntity<AbstractEntity> {
  id: number = 0;
  createTime: string = '';
  updateTime: string = '';

  constructor(data: Partial<AbstractEntity> = {}) {
    Object.assign(this, data);
  }
}
