import { ApplicationContext } from './ApplicationContext'
import { ApiContext, ApiHandler } from './api'
import { Node } from './model'
import { NOT_FOUND, DUPLICATE_ENTRY } from './errors'

export function handler(context: ApplicationContext): ApiHandler {
  return {
    getNodes: async (ctx: ApiContext) => {
      ctx.body = await context.repository.getMany(ctx.query.id || [])
    },

    getNode: async (ctx: ApiContext) => {
      try {
        ctx.body = await context.repository.getOne(ctx.params.id)
      } catch (e) {
        if (e.code === NOT_FOUND) {
          ctx.throw(e.message, 404)
        } else {
          ctx.throw(e.message, 500)
        }
      }
    },

    getNodeChildren: async (ctx: ApiContext) => {
      try {
        ctx.body = await context.repository.getChildren(ctx.params.id)
      } catch (e) {
        if (e.code === NOT_FOUND) {
          ctx.throw(e.message, 404)
        } else {
          ctx.throw(e.message, 500)
        }
      }
    },

    createNodes: async (ctx: ApiContext) => {
      const nodes = await context.repository.save(...ctx.request.body.map((node: any) => new Node(node)))
      ctx.status = 201
      ctx.body = nodes.map(node => node.id)
    },

    createNodeNextVersion: async (ctx: ApiContext) => {
      try {
        const node = await context.repository.saveNext(ctx.params.id, ctx.request.body)
        ctx.status = 201
        ctx.body = node.id
      } catch (e) {
        if (e.code === NOT_FOUND) {
          ctx.throw(e.message, 404)
        } else if (e.code === DUPLICATE_ENTRY) {
          ctx.throw(e.message, 409)
        } else {
          ctx.throw(e.message, 500)
        }
      }
    }
  }
}

export default handler
