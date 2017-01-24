import expressWinston = require('express-winston')
// import { Context } from 'koa'

export default function(options: any) {
  expressWinston.logger(options)
}
