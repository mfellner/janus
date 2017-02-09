import DatabaseType from './DatabaseType'
import Neo4JDatabase from './Neo4JDatabase'

export interface IDatabase<T extends DatabaseType, R> {
  readonly type: T

  run(query: string): Promise<R>
  toString(): string
}

export type Database = Neo4JDatabase
