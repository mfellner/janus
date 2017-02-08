import neo4j, { Driver } from 'neo4j-driver'
import AbstractDatabase from './AbstractDatabase'
import Options from './DatabaseOptions'
import Type from './DatabaseType'

export class Neo4JDatabase extends AbstractDatabase {
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

  async onRun(query: string): Promise<any> {
    const session = this.driver.session()
    const result = await session.run(query)
    session.close()
    return result.records
  }
}

export default Neo4JDatabase
