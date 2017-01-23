// Type definitions for koa-morgan 1.x
// Project: https://github.com/koa-modules/morgan
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'koa-morgan' {
  import { Options } from 'morgan'
  import { Middleware } from 'koa'

  function morgan(format: string, options?: Options): Middleware;

  export = morgan;
}
