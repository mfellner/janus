/// <reference types='jest' />

import supertest = require('supertest')
import { Server } from 'http'
import * as janus from '../src/server'

describe('server', () => {
  let server: Server
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(() => {
    server = janus.start()
    request = supertest.agent(server)
  })

  afterEach(() => server.close())

  it('returns health', async () => {
    await request.get('/health').expect('OK')
  })
})
