/// <reference types='jest' />

import Koa = require('koa')
import bodyParser = require('koa-bodyparser')
import supertest = require('supertest')
import { Server } from 'http'
import * as api from '../src/api'

describe('api', () => {
  it('can load API schema', async () => {
    const spec = await api.getApiSpec()
    expect(spec.info).toBeDefined()
  })

  it('can create the API middleware', async () => {
    const middleware = await api.createSwaggerMiddleware({})
    expect(middleware).toBeInstanceOf(Function)
  })

  describe('middleware', () => {
    let app: Koa
    let server: Server
    let request: supertest.SuperTest<supertest.Test>

    beforeEach(() => {
      app = new Koa()
      app.use(bodyParser())
      server = app.listen(4001)
      request = supertest.agent(server)
    })

    afterEach(() => server ? server.close() : null)

    it('supports the getNodes handler', async () => {
      const middleware = await api.createSwaggerMiddleware({
        getNodes: (ctx, next) => {
          ctx.body = 'OK'
        }
      })
      app.use(middleware)

      await request
        .get('/nodes')
        .expect('OK')
    })

    it('supports the createNodes handler', async () => {
      const middleware = await api.createSwaggerMiddleware({
        createNodes: (ctx, next) => {
          ctx.body = 'OK'
        }
      })
      app.use(middleware)

      await request
        .post('/nodes')
        .send([{
          links: {
            type: 'http://test'
          },
          data: {}
        }])
        .expect('OK')
    })

    it('supports the getNode handler', async () => {
      const middleware = await api.createSwaggerMiddleware({
        getNode: (ctx, next) => {
          ctx.body = ctx.params.id
        }
      })
      app.use(middleware)

      await request
        .get('/nodes/foo')
        .expect('foo')
    })

    it('supports the getNodeChildren handler', async () => {
      const middleware = await api.createSwaggerMiddleware({
        getNodeChildren: (ctx, next) => {
          ctx.body = 'OK'
        }
      })
      app.use(middleware)

      await request
        .get('/nodes/foo/children')
        .expect('OK')
    })

    it('supports the createNodeNextVersion handler', async () => {
      const middleware = await api.createSwaggerMiddleware({
        createNodeNextVersion: (ctx, next) => {
          ctx.body = 'OK'
        }
      })
      app.use(middleware)

      await request
        .put('/nodes/foo/next')
        .send({
          links: {
            type: 'http://test'
          },
          data: {}
        })
        .expect('OK')
    })
  })
})
