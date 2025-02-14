import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRepository, AbstractEntity } from "../src";

class TestEntity extends AbstractEntity {
  name: string  
}

describe('Repository', () => {
  let repository: MemoryRepository<TestEntity>

  beforeEach(() => {
    repository = new MemoryRepository<TestEntity>()
  })

  it('should be defined', () => {
    expect(MemoryRepository).toBeDefined()
  })

  it('should be able to create', () => {
    const entity = new TestEntity()
    entity.name = 'test'
    const result = repository.create({
      name: 'test',
    })
    expect(result).toBeDefined()
  })
})
