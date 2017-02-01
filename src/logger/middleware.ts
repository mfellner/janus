import expressWinston = require('express-winston')
import { Middleware } from 'koa'

export default function(options: expressWinston.Options): Middleware {
  const middlewareFn = expressWinston.logger(options)

  return (ctx, next) => new Promise((resolve, reject) => {
    middlewareFn(ctx.req, ctx.res, err =>
      err ? reject(err) : resolve(ctx)
    )
  }).then(next)
}
