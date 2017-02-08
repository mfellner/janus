/// <reference path="../typings/index.d.ts" />

import Koa = require('koa')
import nconf from './nconf'
import routes from './routes'
import { log, logger } from './logger'
import { Server } from 'http'
import { ApplicationContext, createApplicationContext } from './ApplicationContext'
import 'source-map-support/register'

export function init(context: ApplicationContext): Koa {
  const app = new Koa()
  app.use(logger())
  app.use(routes(context))

  app.on('error', (err: Error) =>
    log.error(err.stack || `${err.name}: ${err.message}`)
  )
  return app
}

export function start(): Server {
  const app = init(createApplicationContext())
  const port = parseInt(nconf.get('JANUS_PORT'))
  const server = app.listen(port)
  log.info('listening on port %d (%s)', port, app.env)
  return server
}
