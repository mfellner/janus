export interface Database {
  run(query: string): Promise<any>
  toString(): string
}

export default Database
