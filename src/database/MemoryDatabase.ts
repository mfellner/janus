import AbstractDatabase from './AbstractDatabase'
import Type from './DatabaseType'

export namespace MemoryDatabase {
  export type Result = Object
}

export class MemoryDatabase extends AbstractDatabase<Type.MEMORY, MemoryDatabase.Result> {
  constructor() {
    super(Type.MEMORY, { host: '', user: '', pass: '' })
  }

  onConnect(): void {
  }

  onDisconnect(): void {
  }

  onRun(query: string): Promise<MemoryDatabase.Result> {
    return Promise.reject(query)
  }

  toString(): string {
    return `memory`
  }
}

export default MemoryDatabase
