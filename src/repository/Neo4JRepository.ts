import Repository from './Repository'
import { Neo4JDatabase } from '../database'
import { Node, Edges } from '../model'

// const MAX_DEPTH = 100

export class Neo4JRepository implements Repository {
  database: Neo4JDatabase

  constructor(database: Neo4JDatabase) {
    this.database = database
  }

  init(): Promise<any> {
    return this.database.run('CREATE INDEX ON :Node(uuid)')
  }

  getOne(id: string): Promise<Node> {
    return Promise.reject(new Error('Not implemented.' + id))
  }

  getMany(ids: string[]): Promise<Node[]> {
    return Promise.reject(new Error('Not implemented.' + ids))
  }

  getChildren(id: string): Promise<Edges> {
    return Promise.reject(new Error('Not implemented.' + id))
  }

  save(...nodes: Node[]): Promise<Node[]> {
    return Promise.reject(new Error('Not implemented.' + nodes))
  }

  saveNext(id: string, node: Node): Promise<Node> {
    return Promise.reject(new Error('Not implemented.' + id + node))
  }

  // getOne(id: string): Promise<any> {
  //   return this.database.run(`MATCH (n:Node)-[includes:includes*..${MAX_DEPTH}]->(ns)
  //     WHERE c.uuid = '${id}'
  //     RETURN *`
  //   )
  // }
  //
  // getAll(): Promise<any[]> {
  //   return this.database.run(`MATCH (n:Node)-[includes:includes*..${MAX_DEPTH}]->(ns)
  //     RETURN *`
  //   )
  // }

  toString() {
    return this.database.toString()
  }
}

export default Neo4JRepository
