export interface Repository {
  getOne(id: string): Promise<any>
  getAll(): Promise<any[]>
  toString(): string
}

export default Repository
