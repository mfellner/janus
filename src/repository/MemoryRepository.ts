import Repository from './Repository'
import { MemoryDatabase } from '../database'

export class MemoryRepository implements Repository {
  store: {[key: string]: any}

  constructor() {
    this.store = {}
  }

  init(): Promise<any> {
    return Promise.reject('Init() not implemented.')
  }

  async getOne(id: string): Promise<any> {
    return this.store[id]
  }

  async getAll(): Promise<any[]> {
    return Object.keys(this.store)
  }

  toString() {
    return 'memory'
  }
}

export default MemoryDatabase
