/// <reference path="../typings/index.d.ts" />

import Koa = require('koa')
import bodyParser = require('koa-bodyparser')
import nconf from './nconf'
import routes from './routes'
import Handler from './Handler'
import { createSwaggerMiddleware } from './api'
import { log, logger } from './logger'
import { Server } from 'http'
import { ApplicationContext, createApplicationContext } from './ApplicationContext'
import 'source-map-support/register'

export async function init(context: ApplicationContext): Promise<Koa> {
  const app = new Koa()
  const handler = Handler(context)
  const swaggerMiddleware = await createSwaggerMiddleware(handler)

  app.use(logger())
  app.use(bodyParser())
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if (ctx.status >= 500) {
        log.error(e)
      }
      ctx.throw(e)
    }
  })
  app.use(swaggerMiddleware)
  app.use(routes(context))

  return app
}

export async function start(port: number): Promise<Server> {
  const app = await init(createApplicationContext())
  const server = app.listen(port)
  log.info('listening on port %d (%s)', port, app.env)
  return server
}

export function main() {
  const port = parseInt(nconf.get('JANUS_PORT'))
  start(port).catch(err => log.error(err))
}
