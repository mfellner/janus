// Type definitions for neo4j-driver 1.x
// Project: https://github.com/neo4j/neo4j-javascript-driver
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'neo4j-driver' {
  export default v1

  export namespace v1 {
    function driver(url: string, authToken: Auth, config?: Object): Driver;
    function int(val: number | string): Integer;
    function isInt(obj: any): boolean;
    const integer: {
      toNumber: (val: number | string) => number;
      toString: (val: number | string, radix?: number) => string;
      inSafeRange: (val: number | string) => boolean;
    };
    const Neo4jError: INeo4jError;
    const auth: {
      basic: (username: string, password: string, realm?: string) => Auth;
      custom: (principal: string, credentials: string, realm: string, scheme: string, parameters?: any) => Auth;
    };
    const types: {
      Node: INode;
      Relationship: IRelationship;
      UnboundRelationship: any;
      PathSegment: any;
      Path: any;
      Result: any;
      ResultSummary: any;
      Record: any;
    };
    const session: {
      READ: 'READ';
      WRITE: 'WRITE';
    };
    const error: {
      SERVICE_UNAVAILABLE: 'ServiceUnavailable';
      SESSION_EXPIRED: 'SessionExpired';
    };
  }

  interface Auth {
    scheme: string;
    principal: string;
    credentials: string;
    realm?: string;
    parameters?: any;
  }

  export interface Driver {
    url: string;
    userAgent: string;
    token: Object;
    config: Object;

    session(mode?: string): Session;
    close(callback?: () => void): void;
  }

  export interface Session {
    run(statement: string | Statement, parameters?: Object): Result;
    close(callback?: () => void): void;
  }

  export interface Statement {
    text: string;
    parameters: Object;
  }

  export interface Result {
    then(
      onFulfilled: (result: { records: Array<Record> }) => void,
      onRejected: (error: { message: string, code: string }) => void
    ): Promise<{ records: Array<Record> }>;

    catch(
      onRejected: (error: { message: string, code: string }) => void
    ): Promise<{ records: Array<Record> }>;

    subscribe(observer: StreamObserver): void;
  }

  export interface StreamObserver {
    onNext(rawRecord: Record): void;
    onCompleted(meta: Object): void;
    onError(error: Object): void;
    subscribe(observer: StreamObserver): void;
  }

  export interface Record {
    keys: any[];
    length: number;
    _fields: any[];

    forEach(callback: (value: any, key: string | number, record: Record) => void): void;
    toObject(): Object;
    get(key: string | number): any;
    has(key: string | number): boolean;
  }

  class Connection {
    constructor(channel: any, url: string);

    url: string;
    server: { address: string };
  }

  interface Integer {
  }

  interface INeo4jError {
    new (message: string, code: string | number): Neo4jError;
  }

  class Neo4jError extends Error {
    constructor(message: string, code: string | number);

    message: string;
    code: string | number;
  }

  interface INode {
    new (identity: string, labels: string[], properties: Object): Node;
  }

  class Node {
    constructor(identity: string, labels: string[], properties: Object);

    identity: string;
    labels: string[];
    properties: Object;

    toString(): string;
  }

  interface IRelationship {
    new (identity: string, start: string, end: string, type: string, properties: Object): Relationship;
  }

  class Relationship {
    constructor(identity: string, start: string, end: string, type: string, properties: Object);

    identity: string;
    start: string;
    end: string;
    type: string;
    properties: Object;

    toString(): string;
  }
}
