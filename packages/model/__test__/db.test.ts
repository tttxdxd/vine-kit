import { describe, expect, it } from 'vitest'
import { DatabaseView, boolean, model, number, string } from '../src'

describe('dBPlugin', () => {
  const UserModel = model({
    name: 'User',
    schema: {
      id: number({ label: 'ID', db: { primaryKey: true, autoIncrement: true } }),
      username: string({ label: 'Username', db: { unique: true } }),
      age: number({ label: 'Age' }),
      isActive: boolean({ label: 'Is Active', db: { defaultValue: 'true' } }),
      createdAt: string({ label: 'Created At', db: { defaultValue: 'CURRENT_TIMESTAMP' } }),
    },
    db: {
      primaryKey: 'id',
      name: 'users',
      indexes: [{ name: 'idx_username', columns: ['username'] }],
      uniques: [{ name: 'uni_username_age', columns: ['username', 'age'] }],
      foreignKeys: [{ name: 'fk_user_id', column: 'user_id', referencedTable: 'users', referencedColumn: 'id' }],
    },
  })

  const dbView = new DatabaseView()

  describe('transformModel', () => {
    it('should transform model options correctly', () => {
      const result = dbView.transformModel(UserModel)
      expect(result).toMatchObject({
        name: 'user',
        index: [{ name: 'idx_username', columns: ['username'] }],
        unique: [{ name: 'uni_username_age', columns: ['username', 'age'] }],
      })
    })

    it('should use snake_case for table name if not provided', () => {
      const TestModel = model({ name: 'TestModel', schema: {} })
      const result = dbView.transformModel(TestModel)
      expect(result.name).toBe('test_model')
    })
  })

  describe('transformField', () => {
    it('should transform field options correctly', () => {
      const idField = UserModel.schema.id
      const result = dbView.transformField('id', idField)
      expect(result).toEqual({
        name: 'id',
        type: 'INT',
        description: '',
        primaryKey: true,
        autoIncrement: true,
        unique: false,
        index: false,
        defaultValue: null,
        onUpdate: '',
      })
    })

    it('should use snake_case for field name', () => {
      const createdAtField = UserModel.schema.createdAt
      const result = dbView.transformField('createdAt', createdAtField)
      expect(result?.name).toBe('created_at')
    })

    it('should return null if db option is false', () => {
      const TestModel = model({
        name: 'Test',
        schema: {
          ignoredField: string({ db: false }),
        },
      })
      const ignoredField = TestModel.schema.ignoredField
      const result = dbView.transformField('ignoredField', ignoredField)
      expect(result).toBeNull()
    })
  })

  describe('transformType', () => {
    it('should transform types correctly', () => {
      expect(dbView.transformType('id', UserModel.schema.id)).toBe('INT')
      expect(dbView.transformType('username', UserModel.schema.username)).toBe('VARCHAR')
      expect(dbView.transformType('isActive', UserModel.schema.isActive)).toBe('BOOLEAN')
      expect(dbView.transformType('createdAt', UserModel.schema.createdAt)).toBe('VARCHAR')
    })
  })
})
