import Repository from './Repository'
import { Node, Edges } from '../model'
import { NotFoundError, DuplicateEntryError } from '../errors'

export class MemoryRepository implements Repository {
  private readonly nodes: { [key: string]: Node }

  constructor() {
    this.nodes = {}
  }

  init(): Promise<any> {
    return Promise.resolve()
  }

  getOne(id: string): Promise<Node> {
    if (id in this.nodes) {
      return Promise.resolve(this.nodes[id])
    } else {
      return Promise.reject(new NotFoundError(`Not found: ${id}`))
    }
  }

  getMany(ids: string[]): Promise<Node[]> {
    if (ids.length > 0) {
      return Promise.all(ids.map(this.getOne.bind(this)))
    } else {
      return Promise.all(Object.keys(this.nodes).map(this.getOne.bind(this)))
    }
  }

  getChildren(id: string): Promise<Edges> {
    return this.getOne(id).then(node => node.children)
  }

  save(...nodes: Node[]): Promise<Node[]> {
    return Promise.all(nodes.map(node => {
      if (node.id in this.nodes) {
        return Promise.reject(new DuplicateEntryError(`Duplicate id ${node.id}`))
      } else {
        this.nodes[node.id] = node
        return Promise.resolve(node)
      }
    }))
  }

  async saveNext(id: string, node: any): Promise<Node> {
    const previousNode = await this.getOne(id)
    if (previousNode.nextVersion) {
      throw new DuplicateEntryError(`Existing next version ${previousNode.nextVersion}`)
    }
    const nextNode = new Node({
      type: node.type,
      previousVersion: previousNode.id,
      data: node.data,
      children: node.children
    })
    const saved = await this.save(nextNode)
    this.nodes[id] = Object.assign(this.nodes[id], { nextVersion: nextNode.id })
    return saved[0]
  }

  toString() {
    return 'memory'
  }
}

export default MemoryRepository
