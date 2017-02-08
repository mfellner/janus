import Repository from './Repository'
import { Database } from '../database'

export class Neo4JRepository implements Repository {
  database: Database

  constructor(database: Database) {
    this.database = database
  }

  getOne(): Promise<any> {
    return this.database.run('MATCH (x) RETURN x')
  }

  getAll(): Promise<any[]> {
    return this.database.run('MATCH (x) RETURN x')
  }

  toString() {
    return this.database.toString()
  }
}

export default Neo4JRepository