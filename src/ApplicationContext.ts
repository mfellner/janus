import nconf from './nconf'
import { Database, DatabaseType, Neo4JDatabase, MemoryDatabase } from './database'
import { Repository, Neo4JRepository, MemoryRepository } from './repository'

export interface ApplicationContext {
  readonly database: Database,
  readonly repository: Repository
}

export function createApplicationContext(): ApplicationContext {
  const database = createDatabase()
  const repository = createRepository(database)

  return {
    database,
    repository
  }
}

function createDatabase(): Database {
  const config = {
    user: nconf.get('JANUS_DB_USER'),
    pass: nconf.get('JANUS_DB_PASS'),
    host: nconf.get('JANUS_DB_HOST')
  }
  const type = nconf.get('JANUS_DB_TYPE')
  switch (type) {
    case 'neo4j':
      return new Neo4JDatabase(config)
    case 'memory':
      return new MemoryDatabase()
    default:
      throw new Error(`Unknown database type ${type}`)
  }
}

function createRepository(database: Database): Repository {
  switch (database.type) {
    case DatabaseType.NEO4J:
      return new Neo4JRepository(database)
    case DatabaseType.MEMORY:
      return new MemoryRepository()
    default:
      throw new Error('Unsupported database type.')
  }
}
