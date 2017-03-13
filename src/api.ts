import fs = require('mz/fs')
import path = require('path')
import yaml = require('js-yaml')
import tv4 = require('tv4')
import swaggerSchema = require('swagger-schema-official/schema.json')
import { log } from './logger'
import { Middleware, Context } from 'koa'
import {
  Spec,
  Path,
  Operation,
  Parameter,
  BodyParameter,
  QueryParameter
} from 'swagger-schema-official'

export type PathParamSet = { [key: string]: string }
export type ApiPathParser = (path: string) => PathParamSet | undefined
export type ApiContext = Context & { params: { [key: string]: string } }
export type ApiMiddleware = (ctx: ApiContext, next: () => Promise<any>) => any
export type ApiHandler = { [key: string]: ApiMiddleware }

tv4.addFormat('uuid', data => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data)) {
    return `"${data}" is not a valid UUID.`
  } else {
    return <any>null
  }
})

tv4.addFormat('uri', data => {
  if (!/^https?:\/\/\S+$/.test(data)) {
    return `"${data}" is not a valid URI.`
  } else {
    return <any>null
  }
})

export async function getApiSpec(): Promise<Spec> {
  const apiYaml = await fs.readFile(path.resolve(__dirname, 'api.yaml'))
  const api = yaml.safeLoad(apiYaml.toString())
  const isValid = tv4.validate(api, swaggerSchema)

  if (!isValid) {
    throw new Error(`${tv4.error.message} in ${tv4.error.dataPath}`)
  }
  return api
}

function createMiddlewareFromApi(api: Spec): (handler: ApiHandler) => Middleware {
  const apiPathParsers: { [key: string]: ApiPathParser } = Object.keys(api.paths)
    .reduce((obj, pathName) => Object.assign(obj, {
      [pathName]: createApiPathParser(pathName)
    }), {})

  function parseApiPath(path: string): [string, Path, PathParamSet] | [void, void, void] {
    for (let pathName in apiPathParsers) {
      const pathParamSet = apiPathParsers[pathName](path)
      if (pathParamSet) {
        return [pathName, api.paths[pathName], pathParamSet]
      }
    }
    return [undefined, undefined, undefined]
  }

  return (handler: ApiHandler) => async (ctx, next) => {
    // Check if path is declared in the API.
    const [pathName, path, pathParamSet] = parseApiPath(ctx.path)
    if (!pathName || !path || !pathParamSet) {
      log.info('Requested path %s is not in API.', ctx.path)
      return next()
    }
    // Check if operation is declared in the API.
    const method = <keyof Path>ctx.method.toLowerCase()
    const operation = <Operation | undefined>path[method]
    if (!operation) {
      log.error('Method %s is not available on path %s.', ctx.method, pathName)
      return ctx.throw(405)
    }
    // Assign path parameters to the context.
    const apictx: ApiContext = Object.assign(ctx, {
      params: Object.assign({}, (<any>ctx).params, { ...pathParamSet })
    })

    // Validate request parameters.
    try {
      validateRequestParameters(api, operation.parameters || [])(apictx)
    } catch (e) {
      log.debug(e.message)
      return ctx.throw(e.message, 400)
    }
    // Call the request handler.
    if (!operation.operationId || !handler[operation.operationId]) {
      log.error('No handler for %s %s', ctx.method, pathName)
      return ctx.throw(501)
    }
    await handler[operation.operationId](apictx, next)
    return next()
  }
}

export function createApiPathParser(pathName: string): ApiPathParser {
  const pattern = pathName.replace(/\//g, '\\/').replace(/\{[^\/]+\}/g, '([^\\s\\/]+)')
  const regexp = new RegExp(`^${pattern}\\/?$`)
  const params = (pathName.match(/\{[^\/]+\}/g) || []).map(s => s.slice(1, s.length - 1))

  return (path: string) => {
    if (!regexp.test(path)) {
      return
    }
    const obj: { [key: string]: string } = {}
    const values = (regexp.exec(path) || []).slice(1)
    for (let i = 0; i < values.length; i += 1) {
      obj[params[i]] = values[i]
    }
    return obj
  }
}

function validateRequestParameters(api: Spec, params: Parameter[]): (ctx: ApiContext) => void {
  const validators: ((ctx: ApiContext) => void)[] = params
    .map((param: any) => {
      // Resolve referenced parameters.
      if (typeof param.$ref === 'string') {
        const name = path.basename(param.$ref)
        return (api.parameters || {})[name]
      } else {
        return param
      }
    })
    .map(createRequestParameterValidator(api))

  return (ctx: ApiContext) => validators.forEach(validator => validator(ctx))
}

function createRequestParameterValidator(api: Spec): (param: Parameter) => (ctx: ApiContext) => void {
  return param => ctx => {
    if (param.in === 'body') {
      const schema = (<BodyParameter>param).schema
      const body = ctx.request.body

      if (param.required && !body) {
        throw new Error(`Required parameter "${param.name}" is missing in request body.`)
      }
      if (schema) {
        const mergedSchema = { ...schema, definitions: api.definitions }
        const isValid = tv4.validate(body, mergedSchema)

        if (!isValid) {
          const message = `${tv4.error.message} in ${tv4.error.dataPath || '/'}`
          throw new Error(`Illegal format in request body "${param.name}". ${message}`)
        }
      }
    } else if (param.in === 'query') {
      const allowEmptyValue = (<QueryParameter>param).allowEmptyValue
      const defaultValue = (<QueryParameter>param).default
      const enumValues = (<QueryParameter>param).enum
      const exclusiveMinimum = (<QueryParameter>param).exclusiveMinimum
      const exclusiveMaximum = (<QueryParameter>param).exclusiveMaximum
      const minimum = (<QueryParameter>param).minimum
      const maximum = (<QueryParameter>param).maximum
      const uniqueItems = (<QueryParameter>param).uniqueItems
      const pattern = (<QueryParameter>param).pattern
      const multipleOf = (<QueryParameter>param).multipleOf

      if (ctx.query[param.name] === undefined) {
        ctx.query[param.name] = defaultValue
      }
      const value = ctx.query[param.name]

      if (param.required && !allowEmptyValue && value === undefined) {
        throw new Error(`Required query parameter "${param.name}" is missing.`)
      }
      if (Array.isArray(enumValues) && enumValues.indexOf(value) === -1) {
        throw new Error(`Query parameter "${param.name}" of value "${value}" must be one of ${enumValues}.`)
      }
      if (exclusiveMinimum !== undefined) {
        const num = parseFloat(value)
        if (num <= exclusiveMinimum) {
          throw new Error(`Query parameter "${param.name}" of value ${num} must be > ${exclusiveMinimum}.`)
        }
      }
      if (exclusiveMaximum !== undefined) {
        const num = parseFloat(value)
        if (num >= exclusiveMaximum) {
          throw new Error(`Query parameter "${param.name}" of value ${num} must be < ${exclusiveMaximum}.`)
        }
      }
      if (minimum !== undefined) {
        const num = parseFloat(value)
        if (num < minimum) {
          throw new Error(`Query parameter "${param.name}" of value ${num} must be >= ${minimum}.`)
        }
      }
      if (maximum !== undefined) {
        const num = parseFloat(value)
        if (num > maximum) {
          throw new Error(`Query parameter "${param.name}" of value ${num} must be <= ${maximum}.`)
        }
      }
      if (uniqueItems && Array.isArray(value) && value.length !== new Set(value).size) {
        throw new Error(`Query parameter "${param.name}" of value ${value} must not conatain duplicate entries.`)
      }
      if (pattern && !(new RegExp(pattern).test(value))) {
        throw new Error(`Query parameter "${param.name}" of value "${value}" does not match ${pattern}`)
      }
      if (multipleOf && value % multipleOf !== 0) {
        throw new Error(`Query parameter "${param.name}" of value ${value} must be a multiple of ${multipleOf}.`)
      }
    } else if (param.in === 'header') {
      const value = ctx.header[param.name]
      if (param.required && value === undefined) {
        throw new Error(`Required header parameter "${param.name}" is missing.`)
      }
    } else if (param.in === 'path') {
      const params = ctx.params || {}
      const value = params[param.name]
      if (param.required && value === undefined) {
        throw new Error(`Required path parameter "${param.name}" is missing.`)
      }
    }
  }
}

export async function createSwaggerMiddleware(handler: ApiHandler): Promise<Middleware> {
  const api = await getApiSpec()
  return createMiddlewareFromApi(api)(handler)
}
