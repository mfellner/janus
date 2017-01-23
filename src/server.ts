/// <reference path="../typings/index.d.ts" />

import * as Koa from 'koa'
import morgan = require('koa-morgan')
import 'source-map-support/register'

export function init(): Koa {
  const app = new Koa()
  app.use(morgan('dev'))
  return app
}

export function start(port: number) {
  init().listen(port)
  console.log('listening on port', port)
}
