// Type definitions for express-winston 2.x
// Project: https://github.com/bithavoc/express-winston
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'express-winston' {
  import { Request, Response, RequestHandler } from 'express'
  import { TransportInstance, LoggerInstance } from 'winston'

  export = expressWinston;

  const expressWinston: ExpressWinston.ExpressWinston;

  namespace ExpressWinston {
    export interface Options {
      transports: TransportInstance[];
      winstonInstance: LoggerInstance;
      level?: string;
      msg?: string;
      expressFormat?: boolean;
      colorize?: boolean;
      meta?: boolean;
      baseMeta?: Object;
      metaField?: string;
      statusLevels?: boolean | Object;
      ignoreRoute(req: Request, res: Response): boolean;
      skip(req: Request, res: Response): boolean;
      requestFilter<K extends keyof Request>(req: Request, propName: K): Request[K];
      responseFilter<K extends keyof Response>(res: Response, propName: K): Response[K];
      requestWhitelist?: string[];
      responseWhitelist?: string[];
      bodyWhitelist?: string[];
      bodyBlacklist?: string[];
      ignoredRoutes?: string[];
      dynamicMeta(req: Request, res: Response): Object[];
    }

    export interface ExpressWinston {
      logger(options: Options): RequestHandler;
      errorLogger(options: Options): RequestHandler;

      requestWhitelist: string[];
      bodyWhitelist: string[];
      bodyBlacklist: string[];
      responseWhitelist: string[];
      ignoredRoutes: string[];
      defaultRequestFilter<K extends keyof Request>(req: Request, propName: K): Request[K];
      defaultResponseFilter<K extends keyof Response>(res: Response, propName: K): Response[K];
      defaultSkip(req: Request, res: Response): false;
    }
  }
}
