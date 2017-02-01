/// <reference path="../typings/index.d.ts" />

import Koa = require('koa')
import nconf from './nconf'
import routes from './routes'
import { logger, middleware } from './logger'
import { Server } from 'http'
import 'source-map-support/register'

export function init(): Koa {
  const app = new Koa()
  app.use(middleware())
  app.use(routes())
  app.on('error', (err: Error) =>
    logger.error(err.stack || `${err.name}: ${err.message}`)
  )
  return app
}

export function start(): Server {
  const app = init()
  const port = parseInt(nconf.get('JANUS_PORT'))
  const server = app.listen(port)
  logger.info('listening on port %d (%s)', port, app.env)
  return server
}
