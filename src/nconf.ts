import path = require('path')
import nconf = require('nconf')

export default nconf
  .argv()
  .env()
  .file(path.join(process.cwd(), 'janus.config.json'))
  .defaults({
    JANUS_PORT: 4001
  })
