import uuid = require('uuid')
import { Edges } from './Edge'

export namespace Node {
  export type Data = { [key: string]: any }
}

export class Node {
  readonly id: string
  readonly type: string
  readonly nextVersion: string | null
  readonly previousVersion: string | null
  readonly data: Node.Data
  readonly children: Edges

  constructor(node: {
    type: string,
    nextVersion?: string,
    previousVersion?: string,
    data: Node.Data,
    children?: Edges
  }) {
    this.id = uuid.v4()
    this.type = node.type
    this.nextVersion = node.nextVersion || null
    this.previousVersion = node.previousVersion || null
    this.data = Object.freeze(node.data)
    this.children = node.children ? node.children.slice() : []
  }

  toJSON(): Object {
    return {
      links: {
        self: this.id,
        type: this.type,
        next_version: this.nextVersion,
        previous_version: this.previousVersion
      },
      data: this.data,
      children: this.children.slice()
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default Node
