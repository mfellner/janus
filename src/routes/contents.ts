import Router = require('koa-router')
import { Services } from './'

export default (router: Router, services: Services) => router
  .get('/contents', async (ctx) => {
    const result = await services.repository.getAll()
    ctx.body = result
  })
  .get('/contents/:id', async (ctx) => {
    const result = await services.repository.getOne()
    ctx.body = result
  })
