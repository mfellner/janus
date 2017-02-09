import Router = require('koa-router')
import { Context } from 'koa'
import { ApplicationContext } from '../ApplicationContext'
import { Node } from '../model'

export default (router: Router, context: ApplicationContext) => router
  .get('/contents', async (ctx) => {
    ctx.body = await context.repository.getMany(ctx.query.id || [])
  })
  .get('/contents/:id', async (ctx) => {
    ctx.body = await context.repository.getOne(ctx.params.id)
  })
  .get('/contents/:id/children', async (ctx) => {
    ctx.body = await context.repository.getChildren(ctx.params.id)
  })
  .put('/contents/:id/next', validatePutRequestBody, async (ctx) => {
    ctx.body = await context.repository.saveNext(ctx.params.id, ctx.request.body)
  })
  .post('/contents', validatePostRequestBody, async (ctx) => {
    ctx.body = await context.repository.save(...ctx.request.body.map((node: any) => new Node(node)))
  })

function validatePutRequestBody(ctx: Context, next: () => Promise<any>): Promise<any> | void {
  const node = ctx.request.body
  if (node.hasOwnProperty('data')) {
    return next()
  } else {
    ctx.throw(400)
  }
}

function validatePostRequestBody(ctx: Context, next: () => Promise<any>): Promise<any> | void {
  if (!Array.isArray(ctx.request.body)) {
    ctx.request.body = [ctx.request.body]
  }
  for (let node of ctx.request.body) {
    if (node.hasOwnProperty('data')) {
      return next()
    } else {
      ctx.throw(400)
    }
  }
}
