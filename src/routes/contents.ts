import Router = require('koa-router')
import { ApplicationContext } from '../ApplicationContext'

export default (router: Router, context: ApplicationContext) => router
  .get('/contents', async (ctx) => {
    const result = await context.repository.getAll()
    ctx.body = result
  })
  .get('/contents/:id', async (ctx) => {
    const result = await context.repository.getOne()
    ctx.body = result
  })
