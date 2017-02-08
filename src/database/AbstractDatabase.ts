import DatabaseType from './DatabaseType'
import Options from './DatabaseOptions'
import { IDatabase } from './Database'
import { log } from '../logger'

export abstract class AbstractDatabase<T extends DatabaseType, R> implements IDatabase<T, R> {
  readonly type: T
  protected host: string
  protected user: string
  protected pass: string
  private connected: boolean

  constructor(type: T, options: Options) {
    this.type = type
    this.host = options.host
    this.user = options.user
    this.pass = options.pass
    this.connected = false
  }

  connect(): void {
    if (this.connected) {
      throw new Error(`Already connected to ${this.toString()}`)
    }
    log.debug('Connect to %s', this.toString())
    this.onConnect()
    this.connected = true
  }

  disconnect(): void {
    if (!this.connected) {
      throw new Error(`Already disconnected from ${this.toString()}`)
    }
    log.debug('Disconnect from %s', this.toString())
    this.onDisconnect()
    this.connected = false
  }

  run(query: string): Promise<R> {
    if (!this.connected) {
      this.connect()
    }
    log.debug('Run query "%s"', query)
    return this.onRun(query)
  }

  abstract toString(): string

  protected abstract onConnect(): void
  protected abstract onDisconnect(): void
  protected abstract onRun(query: string): Promise<R>
}

export default AbstractDatabase
