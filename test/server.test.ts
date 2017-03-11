/// <reference types='jest' />

import supertest = require('supertest')
import { Server } from 'http'
import * as janus from '../src/server'

describe('server', () => {
  let server: Server
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    server = await janus.start(4001)
    request = supertest.agent(server)
  })

  afterEach(() => server ? server.close() : null)

  it('returns health', async () => {
    await request.get('/health').expect('OK')
  })
})
