import Router = require('koa-router')
import compose = require('koa-compose')
import health from './health'

const routes = [health]
const router = routes.reduce((r, fn) => fn(r), new Router())

export default () => compose([router.routes(), router.allowedMethods()])
