import Database from './Database'
import DatabaseType from './DatabaseType'
import Options from './DatabaseOptions'
import { log } from '../logger'

export abstract class AbstractDatabase implements Database {
  protected host: string
  protected user: string
  protected pass: string
  private type: DatabaseType
  private connected: boolean

  constructor(type: DatabaseType, options: Options) {
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
    this.onConnect()
    this.connected = true
  }

  disconnect(): void {
    if (!this.connected) {
      throw new Error(`Disconnected from ${this.toString()}`)
    }
    this.onDisconnect()
    this.connected = false
  }

  run(query: string): Promise<any> {
    if (!this.connected) {
      throw new Error(`Disconnected from ${this.toString()}`)
    }
    log.debug('Run query "%s"', query)
    return this.onRun(query)
  }

  toString(): string {
    return `${DatabaseType[this.type].toLowerCase()}://${this.user}@${this.host}`
  }

  protected abstract onConnect(): void
  protected abstract onDisconnect(): void
  protected abstract onRun(query: string): Promise<any>
}

export default AbstractDatabase
