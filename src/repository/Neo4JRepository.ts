import Repository from './Repository'
import { Neo4JDatabase } from '../database'

const MAX_DEPTH = 100

export class Neo4JRepository implements Repository {
  database: Neo4JDatabase

  constructor(database: Neo4JDatabase) {
    this.database = database
  }

  init(): Promise<any> {
    return this.database.run('CREATE INDEX ON :Node(uuid)')
  }

  getOne(id: string): Promise<any> {
    return this.database.run(`MATCH (n:Node)-[includes:includes*..${MAX_DEPTH}]->(ns)
      WHERE c.uuid = '${id}'
      RETURN *`
    )
  }

  getAll(): Promise<any[]> {
    return this.database.run(`MATCH (n:Node)-[includes:includes*..${MAX_DEPTH}]->(ns)
      RETURN *`
    )
  }

  toString() {
    return this.database.toString()
  }
}

export default Neo4JRepository
