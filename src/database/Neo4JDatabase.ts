import neo4j, { Driver, Record } from 'neo4j-driver'
import AbstractDatabase from './AbstractDatabase'
import Options from './DatabaseOptions'
import Type from './DatabaseType'

export namespace Neo4JDatabase {
  export type Result = Record[]
}

export class Neo4JDatabase extends AbstractDatabase<Type.NEO4J, Neo4JDatabase.Result> {
  private driver: Driver

  constructor(options: Options) {
    super(Type.NEO4J, options)
  }

  onConnect(): void {
    const host = `bolt://${this.host}`
    this.driver = neo4j.driver(host, neo4j.auth.basic(this.user, this.pass))
  }

  onDisconnect(): void {
    this.driver.close()
  }

  async onRun(query: string): Promise<Neo4JDatabase.Result> {
    const session = this.driver.session()
    const result = await session.run(query)
    session.close()
    return result.records
  }

  toString(): string {
    return `neo4j://${this.user}@${this.host}`
  }
}

export default Neo4JDatabase
