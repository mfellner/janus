/// <reference path="../typings/index.d.ts" />

import Koa = require('koa')
import nconf from './nconf'
import routes from './routes'
import { log, logger } from './logger'
import { Server } from 'http'
import * as db from './database'
import * as repo from './repository'
import 'source-map-support/register'

export function init(): Koa {
  const database = new db.Neo4J({
    user: nconf.get('JANUS_DB_USER'),
    pass: nconf.get('JANUS_DB_PASS'),
    host: nconf.get('JANUS_DB_HOST')
  })
  database.connect()
  const repository = new repo.Neo4J(database)

  const app = new Koa()
  app.use(logger())
  app.use(routes({repository}))

  app.on('error', (err: Error) =>
    log.error(err.stack || `${err.name}: ${err.message}`)
  )
  return app
}

export function start(): Server {
  const app = init()
  const port = parseInt(nconf.get('JANUS_PORT'))
  const server = app.listen(port)
  log.info('listening on port %d (%s)', port, app.env)
  return server
}
