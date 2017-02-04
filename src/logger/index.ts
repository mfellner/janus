import expressWinston = require('express-winston')
import createMiddleware from './middleware'
import nconf from '../nconf'
import { Logger, LoggerInstance, transports } from 'winston'
import { Middleware } from 'koa'

const colorize = process.env.NODE_ENV !== 'production'

export const logger: LoggerInstance = new Logger({
  transports: [
    new (transports.Console)({
      colorize,
      level: nconf.get('JANUS_LOG_LEVEL')
    })
  ]
})

export function middleware(options?: expressWinston.Options): Middleware {
  return createMiddleware({
    winstonInstance: logger,
    expressFormat: true,
    meta: false,
    colorize,
    ...options
  })
}
