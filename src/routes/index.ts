import Router = require('koa-router')
import compose = require('koa-compose')
import health from './health'
import contents from './contents'
import { Repository } from '../repository'

export type Services = {
  repository: Repository
}

const routes: ((r: Router, services?: Services) => Router)[] = [
  health,
  contents
]

export default (services: Services) => {
  const router = routes.reduce((r, fn) => fn(r, services), new Router())
  return compose([router.routes(), router.allowedMethods()])
}
