export interface Repository {
  getOne(): Promise<any>
  getAll(): Promise<any[]>
  toString(): string
}

export default Repository
