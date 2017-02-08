import DatabaseType from './DatabaseType'

export interface Database {
  readonly type: DatabaseType

  run(query: string): Promise<any>
  toString(): string
}

export default Database
