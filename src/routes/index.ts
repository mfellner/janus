import Router = require('koa-router')
import compose = require('koa-compose')
import health from './health'
import { ApplicationContext } from '../ApplicationContext'

const routes: ((r: Router, context?: ApplicationContext) => Router)[] = [
  health
]

export default (context: ApplicationContext) => {
  const router = routes.reduce((r, fn) => fn(r, context), new Router())
  return compose([router.routes(), router.allowedMethods()])
}
