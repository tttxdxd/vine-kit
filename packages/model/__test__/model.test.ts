import { describe, expect, it } from 'vitest'

import { boolean, model, number, string } from '../src'

describe('model', () => {
  const UserModel = model({
    name: 'User',
    schema: {
      id: number({ label: 'ID', db: { primaryKey: true, autoIncrement: true }, table: { width: 80 } }),
      username: string({ label: 'Username', db: { unique: true }, table: { width: 120 } }),
      age: number({ label: 'Age', table: { width: 80 } }),
      isActive: boolean({ label: 'Is Active', db: { defaultValue: 'true' }, table: { width: 80 } }),
      createdAt: string({ label: 'Created At', db: { defaultValue: 'CURRENT_TIMESTAMP' }, table: { width: 160 } }),
    },
  })

  describe('createView', () => {
    it('should create a form view', () => {
      const formView = UserModel.toFormView()
      expect(formView.name).toBe('UserFormView')
      expect(formView.schema.username.label).toBe('Username')
      expect(formView.schema.username.type).toBe('string')
    })

    it('should create a db view', () => {
      const dbView = UserModel.toDBView()
      expect(dbView.name).toBe('UserDBView')
      expect(dbView.schema.id.primaryKey).toBe(true)
      expect(dbView.schema.isActive.name).toBe('is_active')
    })

    it('should create a table view', () => {
      const tableView = UserModel.toTableView()
      expect(tableView.name).toBe('UserTableView')
      expect(tableView.schema.username.width).toBe(120)
    })

    it('should throw an error for unknown plugin', () => {
      expect(() => UserModel.toView('unknown')).toThrow('Plugin "unknown" not found')
    })
  })

  describe('validate', () => {
    it('should validate valid data', async () => {
      const result = await UserModel.validate({
        id: 1,
        username: 'john',
        age: 30,
        isActive: true,
        createdAt: '2023-04-01T00:00:00.000Z',
      })
      expect(result.valid).toBe(true)
    })

    it('should invalidate incorrect data types', async () => {
      const result = await UserModel.validate({
        id: 'not a number',
        username: 123,
        age: 'not a number',
        isActive: 'not a boolean',
        createdAt: '2023-04-01T00:00:00.000Z',
      })
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error.cause).toMatchObject({
          id: 'Must be a number',
          username: 'Must be a string',
          age: 'Must be a number',
          isActive: 'Must be a boolean',
        })
      }
    })
  })

  describe('fromJSON', () => {
    it('should convert JSON data to model format', () => {
      const json = {
        id: 1,
        username: 'john',
        age: 30,
        isActive: true,
        createdAt: '2023-04-01T00:00:00.000Z',
      }
      const result = UserModel.fromJSON(json)
      expect(result).toEqual({
        id: 1,
        username: 'john',
        age: 30,
        isActive: true,
        createdAt: '2023-04-01T00:00:00.000Z',
      })
    })
  })

  describe('toJSON', () => {
    it('should convert model data to JSON format', () => {
      const modelData = {
        id: 1,
        username: 'john',
        age: 30,
        isActive: true,
        createdAt: '2023-04-01T00:00:00.000Z',
      }
      const result = UserModel.toJSON(modelData)
      expect(result).toEqual({
        id: 1,
        username: 'john',
        age: 30,
        isActive: true,
        createdAt: '2023-04-01T00:00:00.000Z',
      })
    })
  })

  describe('pick', () => {
    it('should create a new model with picked schema', () => {
      const pickedModel = UserModel.pick('username', 'age')
      expect(pickedModel.name).toBe('UserPicked')
      expect(Object.keys(pickedModel.schema)).toEqual(['username', 'age'])
    })
  })

  describe('omit', () => {
    it('should create a new model without omitted schema', () => {
      const omittedModel = UserModel.omit('id', 'createdAt')
      expect(omittedModel.name).toBe('UserOmitted')
      expect(Object.keys(omittedModel.schema)).toEqual(['username', 'age', 'isActive'])
    })
  })

  describe('required', () => {
    it('should create a new model with required schema', async () => {
      const requiredModel = UserModel.required('username', 'age')
      const result = await requiredModel.validate({
        id: 1,
        isActive: true,
        createdAt: '2023-04-01T00:00:00.000Z',
      })
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error.cause).toMatchObject({
          age: 'Must be a number',
          username: 'Must be a string',
        })
      }
    })
  })
})
