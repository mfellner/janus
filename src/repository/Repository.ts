import { Node, Edges } from '../model'

export interface Repository {
  init(): Promise<void>

  getOne(id: string): Promise<Node>
  getMany(ids: string[]): Promise<Node[]>
  getChildren(id: string): Promise<Edges>

  save(...nodes: Node[]): Promise<Node[]>
  saveNext(id: string, node: Node): Promise<Node>

  toString(): string
}

export default Repository
