
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Pessoa
 * 
 */
export type Pessoa = $Result.DefaultSelection<Prisma.$PessoaPayload>
/**
 * Model Sala
 * 
 */
export type Sala = $Result.DefaultSelection<Prisma.$SalaPayload>
/**
 * Model ParticipanteSala
 * 
 */
export type ParticipanteSala = $Result.DefaultSelection<Prisma.$ParticipanteSalaPayload>
/**
 * Model Voto
 * 
 */
export type Voto = $Result.DefaultSelection<Prisma.$VotoPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Pessoas
 * const pessoas = await prisma.pessoa.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Pessoas
   * const pessoas = await prisma.pessoa.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.pessoa`: Exposes CRUD operations for the **Pessoa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pessoas
    * const pessoas = await prisma.pessoa.findMany()
    * ```
    */
  get pessoa(): Prisma.PessoaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sala`: Exposes CRUD operations for the **Sala** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Salas
    * const salas = await prisma.sala.findMany()
    * ```
    */
  get sala(): Prisma.SalaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.participanteSala`: Exposes CRUD operations for the **ParticipanteSala** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ParticipanteSalas
    * const participanteSalas = await prisma.participanteSala.findMany()
    * ```
    */
  get participanteSala(): Prisma.ParticipanteSalaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.voto`: Exposes CRUD operations for the **Voto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Votos
    * const votos = await prisma.voto.findMany()
    * ```
    */
  get voto(): Prisma.VotoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Pessoa: 'Pessoa',
    Sala: 'Sala',
    ParticipanteSala: 'ParticipanteSala',
    Voto: 'Voto'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "pessoa" | "sala" | "participanteSala" | "voto"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Pessoa: {
        payload: Prisma.$PessoaPayload<ExtArgs>
        fields: Prisma.PessoaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PessoaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PessoaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          findFirst: {
            args: Prisma.PessoaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PessoaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          findMany: {
            args: Prisma.PessoaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>[]
          }
          create: {
            args: Prisma.PessoaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          createMany: {
            args: Prisma.PessoaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PessoaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>[]
          }
          delete: {
            args: Prisma.PessoaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          update: {
            args: Prisma.PessoaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          deleteMany: {
            args: Prisma.PessoaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PessoaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PessoaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>[]
          }
          upsert: {
            args: Prisma.PessoaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PessoaPayload>
          }
          aggregate: {
            args: Prisma.PessoaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePessoa>
          }
          groupBy: {
            args: Prisma.PessoaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PessoaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PessoaCountArgs<ExtArgs>
            result: $Utils.Optional<PessoaCountAggregateOutputType> | number
          }
        }
      }
      Sala: {
        payload: Prisma.$SalaPayload<ExtArgs>
        fields: Prisma.SalaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          findFirst: {
            args: Prisma.SalaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          findMany: {
            args: Prisma.SalaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>[]
          }
          create: {
            args: Prisma.SalaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          createMany: {
            args: Prisma.SalaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>[]
          }
          delete: {
            args: Prisma.SalaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          update: {
            args: Prisma.SalaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          deleteMany: {
            args: Prisma.SalaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SalaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>[]
          }
          upsert: {
            args: Prisma.SalaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          aggregate: {
            args: Prisma.SalaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSala>
          }
          groupBy: {
            args: Prisma.SalaGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalaGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalaCountArgs<ExtArgs>
            result: $Utils.Optional<SalaCountAggregateOutputType> | number
          }
        }
      }
      ParticipanteSala: {
        payload: Prisma.$ParticipanteSalaPayload<ExtArgs>
        fields: Prisma.ParticipanteSalaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipanteSalaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipanteSalaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>
          }
          findFirst: {
            args: Prisma.ParticipanteSalaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipanteSalaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>
          }
          findMany: {
            args: Prisma.ParticipanteSalaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>[]
          }
          create: {
            args: Prisma.ParticipanteSalaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>
          }
          createMany: {
            args: Prisma.ParticipanteSalaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParticipanteSalaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>[]
          }
          delete: {
            args: Prisma.ParticipanteSalaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>
          }
          update: {
            args: Prisma.ParticipanteSalaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>
          }
          deleteMany: {
            args: Prisma.ParticipanteSalaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipanteSalaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParticipanteSalaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>[]
          }
          upsert: {
            args: Prisma.ParticipanteSalaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipanteSalaPayload>
          }
          aggregate: {
            args: Prisma.ParticipanteSalaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipanteSala>
          }
          groupBy: {
            args: Prisma.ParticipanteSalaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipanteSalaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParticipanteSalaCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipanteSalaCountAggregateOutputType> | number
          }
        }
      }
      Voto: {
        payload: Prisma.$VotoPayload<ExtArgs>
        fields: Prisma.VotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>
          }
          findFirst: {
            args: Prisma.VotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>
          }
          findMany: {
            args: Prisma.VotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>[]
          }
          create: {
            args: Prisma.VotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>
          }
          createMany: {
            args: Prisma.VotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>[]
          }
          delete: {
            args: Prisma.VotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>
          }
          update: {
            args: Prisma.VotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>
          }
          deleteMany: {
            args: Prisma.VotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>[]
          }
          upsert: {
            args: Prisma.VotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotoPayload>
          }
          aggregate: {
            args: Prisma.VotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVoto>
          }
          groupBy: {
            args: Prisma.VotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<VotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.VotoCountArgs<ExtArgs>
            result: $Utils.Optional<VotoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    pessoa?: PessoaOmit
    sala?: SalaOmit
    participanteSala?: ParticipanteSalaOmit
    voto?: VotoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PessoaCountOutputType
   */

  export type PessoaCountOutputType = {
    participacoes: number
    salasCriadas: number
    votos: number
  }

  export type PessoaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participacoes?: boolean | PessoaCountOutputTypeCountParticipacoesArgs
    salasCriadas?: boolean | PessoaCountOutputTypeCountSalasCriadasArgs
    votos?: boolean | PessoaCountOutputTypeCountVotosArgs
  }

  // Custom InputTypes
  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PessoaCountOutputType
     */
    select?: PessoaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeCountParticipacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipanteSalaWhereInput
  }

  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeCountSalasCriadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalaWhereInput
  }

  /**
   * PessoaCountOutputType without action
   */
  export type PessoaCountOutputTypeCountVotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VotoWhereInput
  }


  /**
   * Count Type SalaCountOutputType
   */

  export type SalaCountOutputType = {
    participantes: number
    votos: number
  }

  export type SalaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participantes?: boolean | SalaCountOutputTypeCountParticipantesArgs
    votos?: boolean | SalaCountOutputTypeCountVotosArgs
  }

  // Custom InputTypes
  /**
   * SalaCountOutputType without action
   */
  export type SalaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalaCountOutputType
     */
    select?: SalaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SalaCountOutputType without action
   */
  export type SalaCountOutputTypeCountParticipantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipanteSalaWhereInput
  }

  /**
   * SalaCountOutputType without action
   */
  export type SalaCountOutputTypeCountVotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VotoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Pessoa
   */

  export type AggregatePessoa = {
    _count: PessoaCountAggregateOutputType | null
    _min: PessoaMinAggregateOutputType | null
    _max: PessoaMaxAggregateOutputType | null
  }

  export type PessoaMinAggregateOutputType = {
    id: string | null
    nome: string | null
    email: string | null
    email_hash: string | null
    email_confirmado: boolean | null
    codigo_confirmacao: string | null
    codigo_confirmacao_hash: string | null
    codigo_expiracao: Date | null
    senha: string | null
    inativo: boolean | null
    data_criacao: Date | null
  }

  export type PessoaMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    email: string | null
    email_hash: string | null
    email_confirmado: boolean | null
    codigo_confirmacao: string | null
    codigo_confirmacao_hash: string | null
    codigo_expiracao: Date | null
    senha: string | null
    inativo: boolean | null
    data_criacao: Date | null
  }

  export type PessoaCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    email_hash: number
    email_confirmado: number
    codigo_confirmacao: number
    codigo_confirmacao_hash: number
    codigo_expiracao: number
    senha: number
    inativo: number
    data_criacao: number
    _all: number
  }


  export type PessoaMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    email_hash?: true
    email_confirmado?: true
    codigo_confirmacao?: true
    codigo_confirmacao_hash?: true
    codigo_expiracao?: true
    senha?: true
    inativo?: true
    data_criacao?: true
  }

  export type PessoaMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    email_hash?: true
    email_confirmado?: true
    codigo_confirmacao?: true
    codigo_confirmacao_hash?: true
    codigo_expiracao?: true
    senha?: true
    inativo?: true
    data_criacao?: true
  }

  export type PessoaCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    email_hash?: true
    email_confirmado?: true
    codigo_confirmacao?: true
    codigo_confirmacao_hash?: true
    codigo_expiracao?: true
    senha?: true
    inativo?: true
    data_criacao?: true
    _all?: true
  }

  export type PessoaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pessoa to aggregate.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pessoas
    **/
    _count?: true | PessoaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PessoaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PessoaMaxAggregateInputType
  }

  export type GetPessoaAggregateType<T extends PessoaAggregateArgs> = {
        [P in keyof T & keyof AggregatePessoa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePessoa[P]>
      : GetScalarType<T[P], AggregatePessoa[P]>
  }




  export type PessoaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PessoaWhereInput
    orderBy?: PessoaOrderByWithAggregationInput | PessoaOrderByWithAggregationInput[]
    by: PessoaScalarFieldEnum[] | PessoaScalarFieldEnum
    having?: PessoaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PessoaCountAggregateInputType | true
    _min?: PessoaMinAggregateInputType
    _max?: PessoaMaxAggregateInputType
  }

  export type PessoaGroupByOutputType = {
    id: string
    nome: string
    email: string
    email_hash: string
    email_confirmado: boolean
    codigo_confirmacao: string | null
    codigo_confirmacao_hash: string | null
    codigo_expiracao: Date | null
    senha: string
    inativo: boolean
    data_criacao: Date
    _count: PessoaCountAggregateOutputType | null
    _min: PessoaMinAggregateOutputType | null
    _max: PessoaMaxAggregateOutputType | null
  }

  type GetPessoaGroupByPayload<T extends PessoaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PessoaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PessoaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PessoaGroupByOutputType[P]>
            : GetScalarType<T[P], PessoaGroupByOutputType[P]>
        }
      >
    >


  export type PessoaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    email_hash?: boolean
    email_confirmado?: boolean
    codigo_confirmacao?: boolean
    codigo_confirmacao_hash?: boolean
    codigo_expiracao?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
    participacoes?: boolean | Pessoa$participacoesArgs<ExtArgs>
    salasCriadas?: boolean | Pessoa$salasCriadasArgs<ExtArgs>
    votos?: boolean | Pessoa$votosArgs<ExtArgs>
    _count?: boolean | PessoaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pessoa"]>

  export type PessoaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    email_hash?: boolean
    email_confirmado?: boolean
    codigo_confirmacao?: boolean
    codigo_confirmacao_hash?: boolean
    codigo_expiracao?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
  }, ExtArgs["result"]["pessoa"]>

  export type PessoaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    email_hash?: boolean
    email_confirmado?: boolean
    codigo_confirmacao?: boolean
    codigo_confirmacao_hash?: boolean
    codigo_expiracao?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
  }, ExtArgs["result"]["pessoa"]>

  export type PessoaSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    email_hash?: boolean
    email_confirmado?: boolean
    codigo_confirmacao?: boolean
    codigo_confirmacao_hash?: boolean
    codigo_expiracao?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
  }

  export type PessoaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "email" | "email_hash" | "email_confirmado" | "codigo_confirmacao" | "codigo_confirmacao_hash" | "codigo_expiracao" | "senha" | "inativo" | "data_criacao", ExtArgs["result"]["pessoa"]>
  export type PessoaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participacoes?: boolean | Pessoa$participacoesArgs<ExtArgs>
    salasCriadas?: boolean | Pessoa$salasCriadasArgs<ExtArgs>
    votos?: boolean | Pessoa$votosArgs<ExtArgs>
    _count?: boolean | PessoaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PessoaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PessoaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PessoaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pessoa"
    objects: {
      participacoes: Prisma.$ParticipanteSalaPayload<ExtArgs>[]
      salasCriadas: Prisma.$SalaPayload<ExtArgs>[]
      votos: Prisma.$VotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      email: string
      email_hash: string
      email_confirmado: boolean
      codigo_confirmacao: string | null
      codigo_confirmacao_hash: string | null
      codigo_expiracao: Date | null
      senha: string
      inativo: boolean
      data_criacao: Date
    }, ExtArgs["result"]["pessoa"]>
    composites: {}
  }

  type PessoaGetPayload<S extends boolean | null | undefined | PessoaDefaultArgs> = $Result.GetResult<Prisma.$PessoaPayload, S>

  type PessoaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PessoaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PessoaCountAggregateInputType | true
    }

  export interface PessoaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pessoa'], meta: { name: 'Pessoa' } }
    /**
     * Find zero or one Pessoa that matches the filter.
     * @param {PessoaFindUniqueArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PessoaFindUniqueArgs>(args: SelectSubset<T, PessoaFindUniqueArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pessoa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PessoaFindUniqueOrThrowArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PessoaFindUniqueOrThrowArgs>(args: SelectSubset<T, PessoaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pessoa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaFindFirstArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PessoaFindFirstArgs>(args?: SelectSubset<T, PessoaFindFirstArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pessoa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaFindFirstOrThrowArgs} args - Arguments to find a Pessoa
     * @example
     * // Get one Pessoa
     * const pessoa = await prisma.pessoa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PessoaFindFirstOrThrowArgs>(args?: SelectSubset<T, PessoaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pessoas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pessoas
     * const pessoas = await prisma.pessoa.findMany()
     * 
     * // Get first 10 Pessoas
     * const pessoas = await prisma.pessoa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pessoaWithIdOnly = await prisma.pessoa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PessoaFindManyArgs>(args?: SelectSubset<T, PessoaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pessoa.
     * @param {PessoaCreateArgs} args - Arguments to create a Pessoa.
     * @example
     * // Create one Pessoa
     * const Pessoa = await prisma.pessoa.create({
     *   data: {
     *     // ... data to create a Pessoa
     *   }
     * })
     * 
     */
    create<T extends PessoaCreateArgs>(args: SelectSubset<T, PessoaCreateArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pessoas.
     * @param {PessoaCreateManyArgs} args - Arguments to create many Pessoas.
     * @example
     * // Create many Pessoas
     * const pessoa = await prisma.pessoa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PessoaCreateManyArgs>(args?: SelectSubset<T, PessoaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pessoas and returns the data saved in the database.
     * @param {PessoaCreateManyAndReturnArgs} args - Arguments to create many Pessoas.
     * @example
     * // Create many Pessoas
     * const pessoa = await prisma.pessoa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pessoas and only return the `id`
     * const pessoaWithIdOnly = await prisma.pessoa.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PessoaCreateManyAndReturnArgs>(args?: SelectSubset<T, PessoaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pessoa.
     * @param {PessoaDeleteArgs} args - Arguments to delete one Pessoa.
     * @example
     * // Delete one Pessoa
     * const Pessoa = await prisma.pessoa.delete({
     *   where: {
     *     // ... filter to delete one Pessoa
     *   }
     * })
     * 
     */
    delete<T extends PessoaDeleteArgs>(args: SelectSubset<T, PessoaDeleteArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pessoa.
     * @param {PessoaUpdateArgs} args - Arguments to update one Pessoa.
     * @example
     * // Update one Pessoa
     * const pessoa = await prisma.pessoa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PessoaUpdateArgs>(args: SelectSubset<T, PessoaUpdateArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pessoas.
     * @param {PessoaDeleteManyArgs} args - Arguments to filter Pessoas to delete.
     * @example
     * // Delete a few Pessoas
     * const { count } = await prisma.pessoa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PessoaDeleteManyArgs>(args?: SelectSubset<T, PessoaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pessoas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pessoas
     * const pessoa = await prisma.pessoa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PessoaUpdateManyArgs>(args: SelectSubset<T, PessoaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pessoas and returns the data updated in the database.
     * @param {PessoaUpdateManyAndReturnArgs} args - Arguments to update many Pessoas.
     * @example
     * // Update many Pessoas
     * const pessoa = await prisma.pessoa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pessoas and only return the `id`
     * const pessoaWithIdOnly = await prisma.pessoa.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PessoaUpdateManyAndReturnArgs>(args: SelectSubset<T, PessoaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pessoa.
     * @param {PessoaUpsertArgs} args - Arguments to update or create a Pessoa.
     * @example
     * // Update or create a Pessoa
     * const pessoa = await prisma.pessoa.upsert({
     *   create: {
     *     // ... data to create a Pessoa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pessoa we want to update
     *   }
     * })
     */
    upsert<T extends PessoaUpsertArgs>(args: SelectSubset<T, PessoaUpsertArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pessoas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaCountArgs} args - Arguments to filter Pessoas to count.
     * @example
     * // Count the number of Pessoas
     * const count = await prisma.pessoa.count({
     *   where: {
     *     // ... the filter for the Pessoas we want to count
     *   }
     * })
    **/
    count<T extends PessoaCountArgs>(
      args?: Subset<T, PessoaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PessoaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pessoa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PessoaAggregateArgs>(args: Subset<T, PessoaAggregateArgs>): Prisma.PrismaPromise<GetPessoaAggregateType<T>>

    /**
     * Group by Pessoa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PessoaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PessoaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PessoaGroupByArgs['orderBy'] }
        : { orderBy?: PessoaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PessoaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPessoaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pessoa model
   */
  readonly fields: PessoaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pessoa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PessoaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participacoes<T extends Pessoa$participacoesArgs<ExtArgs> = {}>(args?: Subset<T, Pessoa$participacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    salasCriadas<T extends Pessoa$salasCriadasArgs<ExtArgs> = {}>(args?: Subset<T, Pessoa$salasCriadasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    votos<T extends Pessoa$votosArgs<ExtArgs> = {}>(args?: Subset<T, Pessoa$votosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pessoa model
   */
  interface PessoaFieldRefs {
    readonly id: FieldRef<"Pessoa", 'String'>
    readonly nome: FieldRef<"Pessoa", 'String'>
    readonly email: FieldRef<"Pessoa", 'String'>
    readonly email_hash: FieldRef<"Pessoa", 'String'>
    readonly email_confirmado: FieldRef<"Pessoa", 'Boolean'>
    readonly codigo_confirmacao: FieldRef<"Pessoa", 'String'>
    readonly codigo_confirmacao_hash: FieldRef<"Pessoa", 'String'>
    readonly codigo_expiracao: FieldRef<"Pessoa", 'DateTime'>
    readonly senha: FieldRef<"Pessoa", 'String'>
    readonly inativo: FieldRef<"Pessoa", 'Boolean'>
    readonly data_criacao: FieldRef<"Pessoa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pessoa findUnique
   */
  export type PessoaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa findUniqueOrThrow
   */
  export type PessoaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa findFirst
   */
  export type PessoaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pessoas.
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pessoas.
     */
    distinct?: PessoaScalarFieldEnum | PessoaScalarFieldEnum[]
  }

  /**
   * Pessoa findFirstOrThrow
   */
  export type PessoaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoa to fetch.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pessoas.
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pessoas.
     */
    distinct?: PessoaScalarFieldEnum | PessoaScalarFieldEnum[]
  }

  /**
   * Pessoa findMany
   */
  export type PessoaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter, which Pessoas to fetch.
     */
    where?: PessoaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pessoas to fetch.
     */
    orderBy?: PessoaOrderByWithRelationInput | PessoaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pessoas.
     */
    cursor?: PessoaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pessoas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pessoas.
     */
    skip?: number
    distinct?: PessoaScalarFieldEnum | PessoaScalarFieldEnum[]
  }

  /**
   * Pessoa create
   */
  export type PessoaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * The data needed to create a Pessoa.
     */
    data: XOR<PessoaCreateInput, PessoaUncheckedCreateInput>
  }

  /**
   * Pessoa createMany
   */
  export type PessoaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pessoas.
     */
    data: PessoaCreateManyInput | PessoaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pessoa createManyAndReturn
   */
  export type PessoaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * The data used to create many Pessoas.
     */
    data: PessoaCreateManyInput | PessoaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pessoa update
   */
  export type PessoaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * The data needed to update a Pessoa.
     */
    data: XOR<PessoaUpdateInput, PessoaUncheckedUpdateInput>
    /**
     * Choose, which Pessoa to update.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa updateMany
   */
  export type PessoaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pessoas.
     */
    data: XOR<PessoaUpdateManyMutationInput, PessoaUncheckedUpdateManyInput>
    /**
     * Filter which Pessoas to update
     */
    where?: PessoaWhereInput
    /**
     * Limit how many Pessoas to update.
     */
    limit?: number
  }

  /**
   * Pessoa updateManyAndReturn
   */
  export type PessoaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * The data used to update Pessoas.
     */
    data: XOR<PessoaUpdateManyMutationInput, PessoaUncheckedUpdateManyInput>
    /**
     * Filter which Pessoas to update
     */
    where?: PessoaWhereInput
    /**
     * Limit how many Pessoas to update.
     */
    limit?: number
  }

  /**
   * Pessoa upsert
   */
  export type PessoaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * The filter to search for the Pessoa to update in case it exists.
     */
    where: PessoaWhereUniqueInput
    /**
     * In case the Pessoa found by the `where` argument doesn't exist, create a new Pessoa with this data.
     */
    create: XOR<PessoaCreateInput, PessoaUncheckedCreateInput>
    /**
     * In case the Pessoa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PessoaUpdateInput, PessoaUncheckedUpdateInput>
  }

  /**
   * Pessoa delete
   */
  export type PessoaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
    /**
     * Filter which Pessoa to delete.
     */
    where: PessoaWhereUniqueInput
  }

  /**
   * Pessoa deleteMany
   */
  export type PessoaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pessoas to delete
     */
    where?: PessoaWhereInput
    /**
     * Limit how many Pessoas to delete.
     */
    limit?: number
  }

  /**
   * Pessoa.participacoes
   */
  export type Pessoa$participacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    where?: ParticipanteSalaWhereInput
    orderBy?: ParticipanteSalaOrderByWithRelationInput | ParticipanteSalaOrderByWithRelationInput[]
    cursor?: ParticipanteSalaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipanteSalaScalarFieldEnum | ParticipanteSalaScalarFieldEnum[]
  }

  /**
   * Pessoa.salasCriadas
   */
  export type Pessoa$salasCriadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    where?: SalaWhereInput
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    cursor?: SalaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Pessoa.votos
   */
  export type Pessoa$votosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    where?: VotoWhereInput
    orderBy?: VotoOrderByWithRelationInput | VotoOrderByWithRelationInput[]
    cursor?: VotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VotoScalarFieldEnum | VotoScalarFieldEnum[]
  }

  /**
   * Pessoa without action
   */
  export type PessoaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pessoa
     */
    select?: PessoaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pessoa
     */
    omit?: PessoaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PessoaInclude<ExtArgs> | null
  }


  /**
   * Model Sala
   */

  export type AggregateSala = {
    _count: SalaCountAggregateOutputType | null
    _avg: SalaAvgAggregateOutputType | null
    _sum: SalaSumAggregateOutputType | null
    _min: SalaMinAggregateOutputType | null
    _max: SalaMaxAggregateOutputType | null
  }

  export type SalaAvgAggregateOutputType = {
    codigo: number | null
  }

  export type SalaSumAggregateOutputType = {
    codigo: number | null
  }

  export type SalaMinAggregateOutputType = {
    id: string | null
    codigo: number | null
    titulo: string | null
    criado_por: string | null
    senha: string | null
    inativo: boolean | null
    data_criacao: Date | null
    data_alteracao: Date | null
  }

  export type SalaMaxAggregateOutputType = {
    id: string | null
    codigo: number | null
    titulo: string | null
    criado_por: string | null
    senha: string | null
    inativo: boolean | null
    data_criacao: Date | null
    data_alteracao: Date | null
  }

  export type SalaCountAggregateOutputType = {
    id: number
    codigo: number
    titulo: number
    criado_por: number
    senha: number
    inativo: number
    data_criacao: number
    data_alteracao: number
    _all: number
  }


  export type SalaAvgAggregateInputType = {
    codigo?: true
  }

  export type SalaSumAggregateInputType = {
    codigo?: true
  }

  export type SalaMinAggregateInputType = {
    id?: true
    codigo?: true
    titulo?: true
    criado_por?: true
    senha?: true
    inativo?: true
    data_criacao?: true
    data_alteracao?: true
  }

  export type SalaMaxAggregateInputType = {
    id?: true
    codigo?: true
    titulo?: true
    criado_por?: true
    senha?: true
    inativo?: true
    data_criacao?: true
    data_alteracao?: true
  }

  export type SalaCountAggregateInputType = {
    id?: true
    codigo?: true
    titulo?: true
    criado_por?: true
    senha?: true
    inativo?: true
    data_criacao?: true
    data_alteracao?: true
    _all?: true
  }

  export type SalaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sala to aggregate.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Salas
    **/
    _count?: true | SalaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalaMaxAggregateInputType
  }

  export type GetSalaAggregateType<T extends SalaAggregateArgs> = {
        [P in keyof T & keyof AggregateSala]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSala[P]>
      : GetScalarType<T[P], AggregateSala[P]>
  }




  export type SalaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalaWhereInput
    orderBy?: SalaOrderByWithAggregationInput | SalaOrderByWithAggregationInput[]
    by: SalaScalarFieldEnum[] | SalaScalarFieldEnum
    having?: SalaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalaCountAggregateInputType | true
    _avg?: SalaAvgAggregateInputType
    _sum?: SalaSumAggregateInputType
    _min?: SalaMinAggregateInputType
    _max?: SalaMaxAggregateInputType
  }

  export type SalaGroupByOutputType = {
    id: string
    codigo: number
    titulo: string
    criado_por: string
    senha: string | null
    inativo: boolean
    data_criacao: Date
    data_alteracao: Date
    _count: SalaCountAggregateOutputType | null
    _avg: SalaAvgAggregateOutputType | null
    _sum: SalaSumAggregateOutputType | null
    _min: SalaMinAggregateOutputType | null
    _max: SalaMaxAggregateOutputType | null
  }

  type GetSalaGroupByPayload<T extends SalaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalaGroupByOutputType[P]>
            : GetScalarType<T[P], SalaGroupByOutputType[P]>
        }
      >
    >


  export type SalaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigo?: boolean
    titulo?: boolean
    criado_por?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
    data_alteracao?: boolean
    participantes?: boolean | Sala$participantesArgs<ExtArgs>
    proprietario?: boolean | PessoaDefaultArgs<ExtArgs>
    votos?: boolean | Sala$votosArgs<ExtArgs>
    _count?: boolean | SalaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sala"]>

  export type SalaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigo?: boolean
    titulo?: boolean
    criado_por?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
    data_alteracao?: boolean
    proprietario?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sala"]>

  export type SalaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigo?: boolean
    titulo?: boolean
    criado_por?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
    data_alteracao?: boolean
    proprietario?: boolean | PessoaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sala"]>

  export type SalaSelectScalar = {
    id?: boolean
    codigo?: boolean
    titulo?: boolean
    criado_por?: boolean
    senha?: boolean
    inativo?: boolean
    data_criacao?: boolean
    data_alteracao?: boolean
  }

  export type SalaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "codigo" | "titulo" | "criado_por" | "senha" | "inativo" | "data_criacao" | "data_alteracao", ExtArgs["result"]["sala"]>
  export type SalaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participantes?: boolean | Sala$participantesArgs<ExtArgs>
    proprietario?: boolean | PessoaDefaultArgs<ExtArgs>
    votos?: boolean | Sala$votosArgs<ExtArgs>
    _count?: boolean | SalaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SalaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proprietario?: boolean | PessoaDefaultArgs<ExtArgs>
  }
  export type SalaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proprietario?: boolean | PessoaDefaultArgs<ExtArgs>
  }

  export type $SalaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sala"
    objects: {
      participantes: Prisma.$ParticipanteSalaPayload<ExtArgs>[]
      proprietario: Prisma.$PessoaPayload<ExtArgs>
      votos: Prisma.$VotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      codigo: number
      titulo: string
      criado_por: string
      senha: string | null
      inativo: boolean
      data_criacao: Date
      data_alteracao: Date
    }, ExtArgs["result"]["sala"]>
    composites: {}
  }

  type SalaGetPayload<S extends boolean | null | undefined | SalaDefaultArgs> = $Result.GetResult<Prisma.$SalaPayload, S>

  type SalaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SalaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SalaCountAggregateInputType | true
    }

  export interface SalaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sala'], meta: { name: 'Sala' } }
    /**
     * Find zero or one Sala that matches the filter.
     * @param {SalaFindUniqueArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalaFindUniqueArgs>(args: SelectSubset<T, SalaFindUniqueArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sala that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SalaFindUniqueOrThrowArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalaFindUniqueOrThrowArgs>(args: SelectSubset<T, SalaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sala that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaFindFirstArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalaFindFirstArgs>(args?: SelectSubset<T, SalaFindFirstArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sala that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaFindFirstOrThrowArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalaFindFirstOrThrowArgs>(args?: SelectSubset<T, SalaFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Salas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Salas
     * const salas = await prisma.sala.findMany()
     * 
     * // Get first 10 Salas
     * const salas = await prisma.sala.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salaWithIdOnly = await prisma.sala.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalaFindManyArgs>(args?: SelectSubset<T, SalaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sala.
     * @param {SalaCreateArgs} args - Arguments to create a Sala.
     * @example
     * // Create one Sala
     * const Sala = await prisma.sala.create({
     *   data: {
     *     // ... data to create a Sala
     *   }
     * })
     * 
     */
    create<T extends SalaCreateArgs>(args: SelectSubset<T, SalaCreateArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Salas.
     * @param {SalaCreateManyArgs} args - Arguments to create many Salas.
     * @example
     * // Create many Salas
     * const sala = await prisma.sala.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalaCreateManyArgs>(args?: SelectSubset<T, SalaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Salas and returns the data saved in the database.
     * @param {SalaCreateManyAndReturnArgs} args - Arguments to create many Salas.
     * @example
     * // Create many Salas
     * const sala = await prisma.sala.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Salas and only return the `id`
     * const salaWithIdOnly = await prisma.sala.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalaCreateManyAndReturnArgs>(args?: SelectSubset<T, SalaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sala.
     * @param {SalaDeleteArgs} args - Arguments to delete one Sala.
     * @example
     * // Delete one Sala
     * const Sala = await prisma.sala.delete({
     *   where: {
     *     // ... filter to delete one Sala
     *   }
     * })
     * 
     */
    delete<T extends SalaDeleteArgs>(args: SelectSubset<T, SalaDeleteArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sala.
     * @param {SalaUpdateArgs} args - Arguments to update one Sala.
     * @example
     * // Update one Sala
     * const sala = await prisma.sala.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalaUpdateArgs>(args: SelectSubset<T, SalaUpdateArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Salas.
     * @param {SalaDeleteManyArgs} args - Arguments to filter Salas to delete.
     * @example
     * // Delete a few Salas
     * const { count } = await prisma.sala.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalaDeleteManyArgs>(args?: SelectSubset<T, SalaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Salas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Salas
     * const sala = await prisma.sala.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalaUpdateManyArgs>(args: SelectSubset<T, SalaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Salas and returns the data updated in the database.
     * @param {SalaUpdateManyAndReturnArgs} args - Arguments to update many Salas.
     * @example
     * // Update many Salas
     * const sala = await prisma.sala.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Salas and only return the `id`
     * const salaWithIdOnly = await prisma.sala.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SalaUpdateManyAndReturnArgs>(args: SelectSubset<T, SalaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sala.
     * @param {SalaUpsertArgs} args - Arguments to update or create a Sala.
     * @example
     * // Update or create a Sala
     * const sala = await prisma.sala.upsert({
     *   create: {
     *     // ... data to create a Sala
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sala we want to update
     *   }
     * })
     */
    upsert<T extends SalaUpsertArgs>(args: SelectSubset<T, SalaUpsertArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Salas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaCountArgs} args - Arguments to filter Salas to count.
     * @example
     * // Count the number of Salas
     * const count = await prisma.sala.count({
     *   where: {
     *     // ... the filter for the Salas we want to count
     *   }
     * })
    **/
    count<T extends SalaCountArgs>(
      args?: Subset<T, SalaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalaAggregateArgs>(args: Subset<T, SalaAggregateArgs>): Prisma.PrismaPromise<GetSalaAggregateType<T>>

    /**
     * Group by Sala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalaGroupByArgs['orderBy'] }
        : { orderBy?: SalaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sala model
   */
  readonly fields: SalaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sala.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participantes<T extends Sala$participantesArgs<ExtArgs> = {}>(args?: Subset<T, Sala$participantesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    proprietario<T extends PessoaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PessoaDefaultArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    votos<T extends Sala$votosArgs<ExtArgs> = {}>(args?: Subset<T, Sala$votosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sala model
   */
  interface SalaFieldRefs {
    readonly id: FieldRef<"Sala", 'String'>
    readonly codigo: FieldRef<"Sala", 'Int'>
    readonly titulo: FieldRef<"Sala", 'String'>
    readonly criado_por: FieldRef<"Sala", 'String'>
    readonly senha: FieldRef<"Sala", 'String'>
    readonly inativo: FieldRef<"Sala", 'Boolean'>
    readonly data_criacao: FieldRef<"Sala", 'DateTime'>
    readonly data_alteracao: FieldRef<"Sala", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sala findUnique
   */
  export type SalaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala findUniqueOrThrow
   */
  export type SalaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala findFirst
   */
  export type SalaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Salas.
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Salas.
     */
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Sala findFirstOrThrow
   */
  export type SalaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Salas.
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Salas.
     */
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Sala findMany
   */
  export type SalaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Salas to fetch.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Salas.
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Sala create
   */
  export type SalaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * The data needed to create a Sala.
     */
    data: XOR<SalaCreateInput, SalaUncheckedCreateInput>
  }

  /**
   * Sala createMany
   */
  export type SalaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Salas.
     */
    data: SalaCreateManyInput | SalaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sala createManyAndReturn
   */
  export type SalaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * The data used to create many Salas.
     */
    data: SalaCreateManyInput | SalaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sala update
   */
  export type SalaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * The data needed to update a Sala.
     */
    data: XOR<SalaUpdateInput, SalaUncheckedUpdateInput>
    /**
     * Choose, which Sala to update.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala updateMany
   */
  export type SalaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Salas.
     */
    data: XOR<SalaUpdateManyMutationInput, SalaUncheckedUpdateManyInput>
    /**
     * Filter which Salas to update
     */
    where?: SalaWhereInput
    /**
     * Limit how many Salas to update.
     */
    limit?: number
  }

  /**
   * Sala updateManyAndReturn
   */
  export type SalaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * The data used to update Salas.
     */
    data: XOR<SalaUpdateManyMutationInput, SalaUncheckedUpdateManyInput>
    /**
     * Filter which Salas to update
     */
    where?: SalaWhereInput
    /**
     * Limit how many Salas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sala upsert
   */
  export type SalaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * The filter to search for the Sala to update in case it exists.
     */
    where: SalaWhereUniqueInput
    /**
     * In case the Sala found by the `where` argument doesn't exist, create a new Sala with this data.
     */
    create: XOR<SalaCreateInput, SalaUncheckedCreateInput>
    /**
     * In case the Sala was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalaUpdateInput, SalaUncheckedUpdateInput>
  }

  /**
   * Sala delete
   */
  export type SalaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter which Sala to delete.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala deleteMany
   */
  export type SalaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Salas to delete
     */
    where?: SalaWhereInput
    /**
     * Limit how many Salas to delete.
     */
    limit?: number
  }

  /**
   * Sala.participantes
   */
  export type Sala$participantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    where?: ParticipanteSalaWhereInput
    orderBy?: ParticipanteSalaOrderByWithRelationInput | ParticipanteSalaOrderByWithRelationInput[]
    cursor?: ParticipanteSalaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParticipanteSalaScalarFieldEnum | ParticipanteSalaScalarFieldEnum[]
  }

  /**
   * Sala.votos
   */
  export type Sala$votosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    where?: VotoWhereInput
    orderBy?: VotoOrderByWithRelationInput | VotoOrderByWithRelationInput[]
    cursor?: VotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VotoScalarFieldEnum | VotoScalarFieldEnum[]
  }

  /**
   * Sala without action
   */
  export type SalaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
  }


  /**
   * Model ParticipanteSala
   */

  export type AggregateParticipanteSala = {
    _count: ParticipanteSalaCountAggregateOutputType | null
    _min: ParticipanteSalaMinAggregateOutputType | null
    _max: ParticipanteSalaMaxAggregateOutputType | null
  }

  export type ParticipanteSalaMinAggregateOutputType = {
    id: string | null
    sala_id: string | null
    pessoa_id: string | null
    adicionado: Date | null
  }

  export type ParticipanteSalaMaxAggregateOutputType = {
    id: string | null
    sala_id: string | null
    pessoa_id: string | null
    adicionado: Date | null
  }

  export type ParticipanteSalaCountAggregateOutputType = {
    id: number
    sala_id: number
    pessoa_id: number
    adicionado: number
    _all: number
  }


  export type ParticipanteSalaMinAggregateInputType = {
    id?: true
    sala_id?: true
    pessoa_id?: true
    adicionado?: true
  }

  export type ParticipanteSalaMaxAggregateInputType = {
    id?: true
    sala_id?: true
    pessoa_id?: true
    adicionado?: true
  }

  export type ParticipanteSalaCountAggregateInputType = {
    id?: true
    sala_id?: true
    pessoa_id?: true
    adicionado?: true
    _all?: true
  }

  export type ParticipanteSalaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParticipanteSala to aggregate.
     */
    where?: ParticipanteSalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipanteSalas to fetch.
     */
    orderBy?: ParticipanteSalaOrderByWithRelationInput | ParticipanteSalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipanteSalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipanteSalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipanteSalas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ParticipanteSalas
    **/
    _count?: true | ParticipanteSalaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipanteSalaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipanteSalaMaxAggregateInputType
  }

  export type GetParticipanteSalaAggregateType<T extends ParticipanteSalaAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipanteSala]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipanteSala[P]>
      : GetScalarType<T[P], AggregateParticipanteSala[P]>
  }




  export type ParticipanteSalaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipanteSalaWhereInput
    orderBy?: ParticipanteSalaOrderByWithAggregationInput | ParticipanteSalaOrderByWithAggregationInput[]
    by: ParticipanteSalaScalarFieldEnum[] | ParticipanteSalaScalarFieldEnum
    having?: ParticipanteSalaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipanteSalaCountAggregateInputType | true
    _min?: ParticipanteSalaMinAggregateInputType
    _max?: ParticipanteSalaMaxAggregateInputType
  }

  export type ParticipanteSalaGroupByOutputType = {
    id: string
    sala_id: string
    pessoa_id: string
    adicionado: Date
    _count: ParticipanteSalaCountAggregateOutputType | null
    _min: ParticipanteSalaMinAggregateOutputType | null
    _max: ParticipanteSalaMaxAggregateOutputType | null
  }

  type GetParticipanteSalaGroupByPayload<T extends ParticipanteSalaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipanteSalaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipanteSalaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipanteSalaGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipanteSalaGroupByOutputType[P]>
        }
      >
    >


  export type ParticipanteSalaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sala_id?: boolean
    pessoa_id?: boolean
    adicionado?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participanteSala"]>

  export type ParticipanteSalaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sala_id?: boolean
    pessoa_id?: boolean
    adicionado?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participanteSala"]>

  export type ParticipanteSalaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sala_id?: boolean
    pessoa_id?: boolean
    adicionado?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participanteSala"]>

  export type ParticipanteSalaSelectScalar = {
    id?: boolean
    sala_id?: boolean
    pessoa_id?: boolean
    adicionado?: boolean
  }

  export type ParticipanteSalaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sala_id" | "pessoa_id" | "adicionado", ExtArgs["result"]["participanteSala"]>
  export type ParticipanteSalaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }
  export type ParticipanteSalaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }
  export type ParticipanteSalaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }

  export type $ParticipanteSalaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ParticipanteSala"
    objects: {
      pessoa: Prisma.$PessoaPayload<ExtArgs>
      sala: Prisma.$SalaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sala_id: string
      pessoa_id: string
      adicionado: Date
    }, ExtArgs["result"]["participanteSala"]>
    composites: {}
  }

  type ParticipanteSalaGetPayload<S extends boolean | null | undefined | ParticipanteSalaDefaultArgs> = $Result.GetResult<Prisma.$ParticipanteSalaPayload, S>

  type ParticipanteSalaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParticipanteSalaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParticipanteSalaCountAggregateInputType | true
    }

  export interface ParticipanteSalaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ParticipanteSala'], meta: { name: 'ParticipanteSala' } }
    /**
     * Find zero or one ParticipanteSala that matches the filter.
     * @param {ParticipanteSalaFindUniqueArgs} args - Arguments to find a ParticipanteSala
     * @example
     * // Get one ParticipanteSala
     * const participanteSala = await prisma.participanteSala.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipanteSalaFindUniqueArgs>(args: SelectSubset<T, ParticipanteSalaFindUniqueArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ParticipanteSala that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParticipanteSalaFindUniqueOrThrowArgs} args - Arguments to find a ParticipanteSala
     * @example
     * // Get one ParticipanteSala
     * const participanteSala = await prisma.participanteSala.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipanteSalaFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipanteSalaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParticipanteSala that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaFindFirstArgs} args - Arguments to find a ParticipanteSala
     * @example
     * // Get one ParticipanteSala
     * const participanteSala = await prisma.participanteSala.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipanteSalaFindFirstArgs>(args?: SelectSubset<T, ParticipanteSalaFindFirstArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParticipanteSala that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaFindFirstOrThrowArgs} args - Arguments to find a ParticipanteSala
     * @example
     * // Get one ParticipanteSala
     * const participanteSala = await prisma.participanteSala.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipanteSalaFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipanteSalaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ParticipanteSalas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ParticipanteSalas
     * const participanteSalas = await prisma.participanteSala.findMany()
     * 
     * // Get first 10 ParticipanteSalas
     * const participanteSalas = await prisma.participanteSala.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participanteSalaWithIdOnly = await prisma.participanteSala.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipanteSalaFindManyArgs>(args?: SelectSubset<T, ParticipanteSalaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ParticipanteSala.
     * @param {ParticipanteSalaCreateArgs} args - Arguments to create a ParticipanteSala.
     * @example
     * // Create one ParticipanteSala
     * const ParticipanteSala = await prisma.participanteSala.create({
     *   data: {
     *     // ... data to create a ParticipanteSala
     *   }
     * })
     * 
     */
    create<T extends ParticipanteSalaCreateArgs>(args: SelectSubset<T, ParticipanteSalaCreateArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ParticipanteSalas.
     * @param {ParticipanteSalaCreateManyArgs} args - Arguments to create many ParticipanteSalas.
     * @example
     * // Create many ParticipanteSalas
     * const participanteSala = await prisma.participanteSala.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipanteSalaCreateManyArgs>(args?: SelectSubset<T, ParticipanteSalaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ParticipanteSalas and returns the data saved in the database.
     * @param {ParticipanteSalaCreateManyAndReturnArgs} args - Arguments to create many ParticipanteSalas.
     * @example
     * // Create many ParticipanteSalas
     * const participanteSala = await prisma.participanteSala.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ParticipanteSalas and only return the `id`
     * const participanteSalaWithIdOnly = await prisma.participanteSala.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParticipanteSalaCreateManyAndReturnArgs>(args?: SelectSubset<T, ParticipanteSalaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ParticipanteSala.
     * @param {ParticipanteSalaDeleteArgs} args - Arguments to delete one ParticipanteSala.
     * @example
     * // Delete one ParticipanteSala
     * const ParticipanteSala = await prisma.participanteSala.delete({
     *   where: {
     *     // ... filter to delete one ParticipanteSala
     *   }
     * })
     * 
     */
    delete<T extends ParticipanteSalaDeleteArgs>(args: SelectSubset<T, ParticipanteSalaDeleteArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ParticipanteSala.
     * @param {ParticipanteSalaUpdateArgs} args - Arguments to update one ParticipanteSala.
     * @example
     * // Update one ParticipanteSala
     * const participanteSala = await prisma.participanteSala.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipanteSalaUpdateArgs>(args: SelectSubset<T, ParticipanteSalaUpdateArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ParticipanteSalas.
     * @param {ParticipanteSalaDeleteManyArgs} args - Arguments to filter ParticipanteSalas to delete.
     * @example
     * // Delete a few ParticipanteSalas
     * const { count } = await prisma.participanteSala.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipanteSalaDeleteManyArgs>(args?: SelectSubset<T, ParticipanteSalaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParticipanteSalas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ParticipanteSalas
     * const participanteSala = await prisma.participanteSala.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipanteSalaUpdateManyArgs>(args: SelectSubset<T, ParticipanteSalaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParticipanteSalas and returns the data updated in the database.
     * @param {ParticipanteSalaUpdateManyAndReturnArgs} args - Arguments to update many ParticipanteSalas.
     * @example
     * // Update many ParticipanteSalas
     * const participanteSala = await prisma.participanteSala.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ParticipanteSalas and only return the `id`
     * const participanteSalaWithIdOnly = await prisma.participanteSala.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParticipanteSalaUpdateManyAndReturnArgs>(args: SelectSubset<T, ParticipanteSalaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ParticipanteSala.
     * @param {ParticipanteSalaUpsertArgs} args - Arguments to update or create a ParticipanteSala.
     * @example
     * // Update or create a ParticipanteSala
     * const participanteSala = await prisma.participanteSala.upsert({
     *   create: {
     *     // ... data to create a ParticipanteSala
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ParticipanteSala we want to update
     *   }
     * })
     */
    upsert<T extends ParticipanteSalaUpsertArgs>(args: SelectSubset<T, ParticipanteSalaUpsertArgs<ExtArgs>>): Prisma__ParticipanteSalaClient<$Result.GetResult<Prisma.$ParticipanteSalaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ParticipanteSalas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaCountArgs} args - Arguments to filter ParticipanteSalas to count.
     * @example
     * // Count the number of ParticipanteSalas
     * const count = await prisma.participanteSala.count({
     *   where: {
     *     // ... the filter for the ParticipanteSalas we want to count
     *   }
     * })
    **/
    count<T extends ParticipanteSalaCountArgs>(
      args?: Subset<T, ParticipanteSalaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipanteSalaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ParticipanteSala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParticipanteSalaAggregateArgs>(args: Subset<T, ParticipanteSalaAggregateArgs>): Prisma.PrismaPromise<GetParticipanteSalaAggregateType<T>>

    /**
     * Group by ParticipanteSala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipanteSalaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParticipanteSalaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipanteSalaGroupByArgs['orderBy'] }
        : { orderBy?: ParticipanteSalaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParticipanteSalaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipanteSalaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ParticipanteSala model
   */
  readonly fields: ParticipanteSalaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ParticipanteSala.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipanteSalaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pessoa<T extends PessoaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PessoaDefaultArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sala<T extends SalaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SalaDefaultArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ParticipanteSala model
   */
  interface ParticipanteSalaFieldRefs {
    readonly id: FieldRef<"ParticipanteSala", 'String'>
    readonly sala_id: FieldRef<"ParticipanteSala", 'String'>
    readonly pessoa_id: FieldRef<"ParticipanteSala", 'String'>
    readonly adicionado: FieldRef<"ParticipanteSala", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ParticipanteSala findUnique
   */
  export type ParticipanteSalaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * Filter, which ParticipanteSala to fetch.
     */
    where: ParticipanteSalaWhereUniqueInput
  }

  /**
   * ParticipanteSala findUniqueOrThrow
   */
  export type ParticipanteSalaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * Filter, which ParticipanteSala to fetch.
     */
    where: ParticipanteSalaWhereUniqueInput
  }

  /**
   * ParticipanteSala findFirst
   */
  export type ParticipanteSalaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * Filter, which ParticipanteSala to fetch.
     */
    where?: ParticipanteSalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipanteSalas to fetch.
     */
    orderBy?: ParticipanteSalaOrderByWithRelationInput | ParticipanteSalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParticipanteSalas.
     */
    cursor?: ParticipanteSalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipanteSalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipanteSalas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipanteSalas.
     */
    distinct?: ParticipanteSalaScalarFieldEnum | ParticipanteSalaScalarFieldEnum[]
  }

  /**
   * ParticipanteSala findFirstOrThrow
   */
  export type ParticipanteSalaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * Filter, which ParticipanteSala to fetch.
     */
    where?: ParticipanteSalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipanteSalas to fetch.
     */
    orderBy?: ParticipanteSalaOrderByWithRelationInput | ParticipanteSalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParticipanteSalas.
     */
    cursor?: ParticipanteSalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipanteSalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipanteSalas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipanteSalas.
     */
    distinct?: ParticipanteSalaScalarFieldEnum | ParticipanteSalaScalarFieldEnum[]
  }

  /**
   * ParticipanteSala findMany
   */
  export type ParticipanteSalaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * Filter, which ParticipanteSalas to fetch.
     */
    where?: ParticipanteSalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipanteSalas to fetch.
     */
    orderBy?: ParticipanteSalaOrderByWithRelationInput | ParticipanteSalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ParticipanteSalas.
     */
    cursor?: ParticipanteSalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipanteSalas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipanteSalas.
     */
    skip?: number
    distinct?: ParticipanteSalaScalarFieldEnum | ParticipanteSalaScalarFieldEnum[]
  }

  /**
   * ParticipanteSala create
   */
  export type ParticipanteSalaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * The data needed to create a ParticipanteSala.
     */
    data: XOR<ParticipanteSalaCreateInput, ParticipanteSalaUncheckedCreateInput>
  }

  /**
   * ParticipanteSala createMany
   */
  export type ParticipanteSalaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ParticipanteSalas.
     */
    data: ParticipanteSalaCreateManyInput | ParticipanteSalaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParticipanteSala createManyAndReturn
   */
  export type ParticipanteSalaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * The data used to create many ParticipanteSalas.
     */
    data: ParticipanteSalaCreateManyInput | ParticipanteSalaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParticipanteSala update
   */
  export type ParticipanteSalaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * The data needed to update a ParticipanteSala.
     */
    data: XOR<ParticipanteSalaUpdateInput, ParticipanteSalaUncheckedUpdateInput>
    /**
     * Choose, which ParticipanteSala to update.
     */
    where: ParticipanteSalaWhereUniqueInput
  }

  /**
   * ParticipanteSala updateMany
   */
  export type ParticipanteSalaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ParticipanteSalas.
     */
    data: XOR<ParticipanteSalaUpdateManyMutationInput, ParticipanteSalaUncheckedUpdateManyInput>
    /**
     * Filter which ParticipanteSalas to update
     */
    where?: ParticipanteSalaWhereInput
    /**
     * Limit how many ParticipanteSalas to update.
     */
    limit?: number
  }

  /**
   * ParticipanteSala updateManyAndReturn
   */
  export type ParticipanteSalaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * The data used to update ParticipanteSalas.
     */
    data: XOR<ParticipanteSalaUpdateManyMutationInput, ParticipanteSalaUncheckedUpdateManyInput>
    /**
     * Filter which ParticipanteSalas to update
     */
    where?: ParticipanteSalaWhereInput
    /**
     * Limit how many ParticipanteSalas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParticipanteSala upsert
   */
  export type ParticipanteSalaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * The filter to search for the ParticipanteSala to update in case it exists.
     */
    where: ParticipanteSalaWhereUniqueInput
    /**
     * In case the ParticipanteSala found by the `where` argument doesn't exist, create a new ParticipanteSala with this data.
     */
    create: XOR<ParticipanteSalaCreateInput, ParticipanteSalaUncheckedCreateInput>
    /**
     * In case the ParticipanteSala was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipanteSalaUpdateInput, ParticipanteSalaUncheckedUpdateInput>
  }

  /**
   * ParticipanteSala delete
   */
  export type ParticipanteSalaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
    /**
     * Filter which ParticipanteSala to delete.
     */
    where: ParticipanteSalaWhereUniqueInput
  }

  /**
   * ParticipanteSala deleteMany
   */
  export type ParticipanteSalaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParticipanteSalas to delete
     */
    where?: ParticipanteSalaWhereInput
    /**
     * Limit how many ParticipanteSalas to delete.
     */
    limit?: number
  }

  /**
   * ParticipanteSala without action
   */
  export type ParticipanteSalaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipanteSala
     */
    select?: ParticipanteSalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipanteSala
     */
    omit?: ParticipanteSalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipanteSalaInclude<ExtArgs> | null
  }


  /**
   * Model Voto
   */

  export type AggregateVoto = {
    _count: VotoCountAggregateOutputType | null
    _avg: VotoAvgAggregateOutputType | null
    _sum: VotoSumAggregateOutputType | null
    _min: VotoMinAggregateOutputType | null
    _max: VotoMaxAggregateOutputType | null
  }

  export type VotoAvgAggregateOutputType = {
    valor: number | null
  }

  export type VotoSumAggregateOutputType = {
    valor: number | null
  }

  export type VotoMinAggregateOutputType = {
    id: string | null
    pessoa_id: string | null
    sala_id: string | null
    valor: number | null
    data_voto: Date | null
  }

  export type VotoMaxAggregateOutputType = {
    id: string | null
    pessoa_id: string | null
    sala_id: string | null
    valor: number | null
    data_voto: Date | null
  }

  export type VotoCountAggregateOutputType = {
    id: number
    pessoa_id: number
    sala_id: number
    valor: number
    data_voto: number
    _all: number
  }


  export type VotoAvgAggregateInputType = {
    valor?: true
  }

  export type VotoSumAggregateInputType = {
    valor?: true
  }

  export type VotoMinAggregateInputType = {
    id?: true
    pessoa_id?: true
    sala_id?: true
    valor?: true
    data_voto?: true
  }

  export type VotoMaxAggregateInputType = {
    id?: true
    pessoa_id?: true
    sala_id?: true
    valor?: true
    data_voto?: true
  }

  export type VotoCountAggregateInputType = {
    id?: true
    pessoa_id?: true
    sala_id?: true
    valor?: true
    data_voto?: true
    _all?: true
  }

  export type VotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Voto to aggregate.
     */
    where?: VotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votos to fetch.
     */
    orderBy?: VotoOrderByWithRelationInput | VotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Votos
    **/
    _count?: true | VotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VotoMaxAggregateInputType
  }

  export type GetVotoAggregateType<T extends VotoAggregateArgs> = {
        [P in keyof T & keyof AggregateVoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVoto[P]>
      : GetScalarType<T[P], AggregateVoto[P]>
  }




  export type VotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VotoWhereInput
    orderBy?: VotoOrderByWithAggregationInput | VotoOrderByWithAggregationInput[]
    by: VotoScalarFieldEnum[] | VotoScalarFieldEnum
    having?: VotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VotoCountAggregateInputType | true
    _avg?: VotoAvgAggregateInputType
    _sum?: VotoSumAggregateInputType
    _min?: VotoMinAggregateInputType
    _max?: VotoMaxAggregateInputType
  }

  export type VotoGroupByOutputType = {
    id: string
    pessoa_id: string
    sala_id: string
    valor: number
    data_voto: Date
    _count: VotoCountAggregateOutputType | null
    _avg: VotoAvgAggregateOutputType | null
    _sum: VotoSumAggregateOutputType | null
    _min: VotoMinAggregateOutputType | null
    _max: VotoMaxAggregateOutputType | null
  }

  type GetVotoGroupByPayload<T extends VotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VotoGroupByOutputType[P]>
            : GetScalarType<T[P], VotoGroupByOutputType[P]>
        }
      >
    >


  export type VotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pessoa_id?: boolean
    sala_id?: boolean
    valor?: boolean
    data_voto?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["voto"]>

  export type VotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pessoa_id?: boolean
    sala_id?: boolean
    valor?: boolean
    data_voto?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["voto"]>

  export type VotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pessoa_id?: boolean
    sala_id?: boolean
    valor?: boolean
    data_voto?: boolean
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["voto"]>

  export type VotoSelectScalar = {
    id?: boolean
    pessoa_id?: boolean
    sala_id?: boolean
    valor?: boolean
    data_voto?: boolean
  }

  export type VotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pessoa_id" | "sala_id" | "valor" | "data_voto", ExtArgs["result"]["voto"]>
  export type VotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }
  export type VotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }
  export type VotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pessoa?: boolean | PessoaDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }

  export type $VotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Voto"
    objects: {
      pessoa: Prisma.$PessoaPayload<ExtArgs>
      sala: Prisma.$SalaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pessoa_id: string
      sala_id: string
      valor: number
      data_voto: Date
    }, ExtArgs["result"]["voto"]>
    composites: {}
  }

  type VotoGetPayload<S extends boolean | null | undefined | VotoDefaultArgs> = $Result.GetResult<Prisma.$VotoPayload, S>

  type VotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VotoCountAggregateInputType | true
    }

  export interface VotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Voto'], meta: { name: 'Voto' } }
    /**
     * Find zero or one Voto that matches the filter.
     * @param {VotoFindUniqueArgs} args - Arguments to find a Voto
     * @example
     * // Get one Voto
     * const voto = await prisma.voto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VotoFindUniqueArgs>(args: SelectSubset<T, VotoFindUniqueArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Voto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VotoFindUniqueOrThrowArgs} args - Arguments to find a Voto
     * @example
     * // Get one Voto
     * const voto = await prisma.voto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VotoFindUniqueOrThrowArgs>(args: SelectSubset<T, VotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Voto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoFindFirstArgs} args - Arguments to find a Voto
     * @example
     * // Get one Voto
     * const voto = await prisma.voto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VotoFindFirstArgs>(args?: SelectSubset<T, VotoFindFirstArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Voto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoFindFirstOrThrowArgs} args - Arguments to find a Voto
     * @example
     * // Get one Voto
     * const voto = await prisma.voto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VotoFindFirstOrThrowArgs>(args?: SelectSubset<T, VotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Votos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Votos
     * const votos = await prisma.voto.findMany()
     * 
     * // Get first 10 Votos
     * const votos = await prisma.voto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const votoWithIdOnly = await prisma.voto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VotoFindManyArgs>(args?: SelectSubset<T, VotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Voto.
     * @param {VotoCreateArgs} args - Arguments to create a Voto.
     * @example
     * // Create one Voto
     * const Voto = await prisma.voto.create({
     *   data: {
     *     // ... data to create a Voto
     *   }
     * })
     * 
     */
    create<T extends VotoCreateArgs>(args: SelectSubset<T, VotoCreateArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Votos.
     * @param {VotoCreateManyArgs} args - Arguments to create many Votos.
     * @example
     * // Create many Votos
     * const voto = await prisma.voto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VotoCreateManyArgs>(args?: SelectSubset<T, VotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Votos and returns the data saved in the database.
     * @param {VotoCreateManyAndReturnArgs} args - Arguments to create many Votos.
     * @example
     * // Create many Votos
     * const voto = await prisma.voto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Votos and only return the `id`
     * const votoWithIdOnly = await prisma.voto.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VotoCreateManyAndReturnArgs>(args?: SelectSubset<T, VotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Voto.
     * @param {VotoDeleteArgs} args - Arguments to delete one Voto.
     * @example
     * // Delete one Voto
     * const Voto = await prisma.voto.delete({
     *   where: {
     *     // ... filter to delete one Voto
     *   }
     * })
     * 
     */
    delete<T extends VotoDeleteArgs>(args: SelectSubset<T, VotoDeleteArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Voto.
     * @param {VotoUpdateArgs} args - Arguments to update one Voto.
     * @example
     * // Update one Voto
     * const voto = await prisma.voto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VotoUpdateArgs>(args: SelectSubset<T, VotoUpdateArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Votos.
     * @param {VotoDeleteManyArgs} args - Arguments to filter Votos to delete.
     * @example
     * // Delete a few Votos
     * const { count } = await prisma.voto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VotoDeleteManyArgs>(args?: SelectSubset<T, VotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Votos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Votos
     * const voto = await prisma.voto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VotoUpdateManyArgs>(args: SelectSubset<T, VotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Votos and returns the data updated in the database.
     * @param {VotoUpdateManyAndReturnArgs} args - Arguments to update many Votos.
     * @example
     * // Update many Votos
     * const voto = await prisma.voto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Votos and only return the `id`
     * const votoWithIdOnly = await prisma.voto.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VotoUpdateManyAndReturnArgs>(args: SelectSubset<T, VotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Voto.
     * @param {VotoUpsertArgs} args - Arguments to update or create a Voto.
     * @example
     * // Update or create a Voto
     * const voto = await prisma.voto.upsert({
     *   create: {
     *     // ... data to create a Voto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Voto we want to update
     *   }
     * })
     */
    upsert<T extends VotoUpsertArgs>(args: SelectSubset<T, VotoUpsertArgs<ExtArgs>>): Prisma__VotoClient<$Result.GetResult<Prisma.$VotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Votos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoCountArgs} args - Arguments to filter Votos to count.
     * @example
     * // Count the number of Votos
     * const count = await prisma.voto.count({
     *   where: {
     *     // ... the filter for the Votos we want to count
     *   }
     * })
    **/
    count<T extends VotoCountArgs>(
      args?: Subset<T, VotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Voto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VotoAggregateArgs>(args: Subset<T, VotoAggregateArgs>): Prisma.PrismaPromise<GetVotoAggregateType<T>>

    /**
     * Group by Voto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VotoGroupByArgs['orderBy'] }
        : { orderBy?: VotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Voto model
   */
  readonly fields: VotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Voto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pessoa<T extends PessoaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PessoaDefaultArgs<ExtArgs>>): Prisma__PessoaClient<$Result.GetResult<Prisma.$PessoaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sala<T extends SalaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SalaDefaultArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Voto model
   */
  interface VotoFieldRefs {
    readonly id: FieldRef<"Voto", 'String'>
    readonly pessoa_id: FieldRef<"Voto", 'String'>
    readonly sala_id: FieldRef<"Voto", 'String'>
    readonly valor: FieldRef<"Voto", 'Int'>
    readonly data_voto: FieldRef<"Voto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Voto findUnique
   */
  export type VotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * Filter, which Voto to fetch.
     */
    where: VotoWhereUniqueInput
  }

  /**
   * Voto findUniqueOrThrow
   */
  export type VotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * Filter, which Voto to fetch.
     */
    where: VotoWhereUniqueInput
  }

  /**
   * Voto findFirst
   */
  export type VotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * Filter, which Voto to fetch.
     */
    where?: VotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votos to fetch.
     */
    orderBy?: VotoOrderByWithRelationInput | VotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Votos.
     */
    cursor?: VotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Votos.
     */
    distinct?: VotoScalarFieldEnum | VotoScalarFieldEnum[]
  }

  /**
   * Voto findFirstOrThrow
   */
  export type VotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * Filter, which Voto to fetch.
     */
    where?: VotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votos to fetch.
     */
    orderBy?: VotoOrderByWithRelationInput | VotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Votos.
     */
    cursor?: VotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Votos.
     */
    distinct?: VotoScalarFieldEnum | VotoScalarFieldEnum[]
  }

  /**
   * Voto findMany
   */
  export type VotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * Filter, which Votos to fetch.
     */
    where?: VotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votos to fetch.
     */
    orderBy?: VotoOrderByWithRelationInput | VotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Votos.
     */
    cursor?: VotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votos.
     */
    skip?: number
    distinct?: VotoScalarFieldEnum | VotoScalarFieldEnum[]
  }

  /**
   * Voto create
   */
  export type VotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * The data needed to create a Voto.
     */
    data: XOR<VotoCreateInput, VotoUncheckedCreateInput>
  }

  /**
   * Voto createMany
   */
  export type VotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Votos.
     */
    data: VotoCreateManyInput | VotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Voto createManyAndReturn
   */
  export type VotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * The data used to create many Votos.
     */
    data: VotoCreateManyInput | VotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Voto update
   */
  export type VotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * The data needed to update a Voto.
     */
    data: XOR<VotoUpdateInput, VotoUncheckedUpdateInput>
    /**
     * Choose, which Voto to update.
     */
    where: VotoWhereUniqueInput
  }

  /**
   * Voto updateMany
   */
  export type VotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Votos.
     */
    data: XOR<VotoUpdateManyMutationInput, VotoUncheckedUpdateManyInput>
    /**
     * Filter which Votos to update
     */
    where?: VotoWhereInput
    /**
     * Limit how many Votos to update.
     */
    limit?: number
  }

  /**
   * Voto updateManyAndReturn
   */
  export type VotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * The data used to update Votos.
     */
    data: XOR<VotoUpdateManyMutationInput, VotoUncheckedUpdateManyInput>
    /**
     * Filter which Votos to update
     */
    where?: VotoWhereInput
    /**
     * Limit how many Votos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Voto upsert
   */
  export type VotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * The filter to search for the Voto to update in case it exists.
     */
    where: VotoWhereUniqueInput
    /**
     * In case the Voto found by the `where` argument doesn't exist, create a new Voto with this data.
     */
    create: XOR<VotoCreateInput, VotoUncheckedCreateInput>
    /**
     * In case the Voto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VotoUpdateInput, VotoUncheckedUpdateInput>
  }

  /**
   * Voto delete
   */
  export type VotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
    /**
     * Filter which Voto to delete.
     */
    where: VotoWhereUniqueInput
  }

  /**
   * Voto deleteMany
   */
  export type VotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Votos to delete
     */
    where?: VotoWhereInput
    /**
     * Limit how many Votos to delete.
     */
    limit?: number
  }

  /**
   * Voto without action
   */
  export type VotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Voto
     */
    select?: VotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Voto
     */
    omit?: VotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PessoaScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    email_hash: 'email_hash',
    email_confirmado: 'email_confirmado',
    codigo_confirmacao: 'codigo_confirmacao',
    codigo_confirmacao_hash: 'codigo_confirmacao_hash',
    codigo_expiracao: 'codigo_expiracao',
    senha: 'senha',
    inativo: 'inativo',
    data_criacao: 'data_criacao'
  };

  export type PessoaScalarFieldEnum = (typeof PessoaScalarFieldEnum)[keyof typeof PessoaScalarFieldEnum]


  export const SalaScalarFieldEnum: {
    id: 'id',
    codigo: 'codigo',
    titulo: 'titulo',
    criado_por: 'criado_por',
    senha: 'senha',
    inativo: 'inativo',
    data_criacao: 'data_criacao',
    data_alteracao: 'data_alteracao'
  };

  export type SalaScalarFieldEnum = (typeof SalaScalarFieldEnum)[keyof typeof SalaScalarFieldEnum]


  export const ParticipanteSalaScalarFieldEnum: {
    id: 'id',
    sala_id: 'sala_id',
    pessoa_id: 'pessoa_id',
    adicionado: 'adicionado'
  };

  export type ParticipanteSalaScalarFieldEnum = (typeof ParticipanteSalaScalarFieldEnum)[keyof typeof ParticipanteSalaScalarFieldEnum]


  export const VotoScalarFieldEnum: {
    id: 'id',
    pessoa_id: 'pessoa_id',
    sala_id: 'sala_id',
    valor: 'valor',
    data_voto: 'data_voto'
  };

  export type VotoScalarFieldEnum = (typeof VotoScalarFieldEnum)[keyof typeof VotoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PessoaWhereInput = {
    AND?: PessoaWhereInput | PessoaWhereInput[]
    OR?: PessoaWhereInput[]
    NOT?: PessoaWhereInput | PessoaWhereInput[]
    id?: StringFilter<"Pessoa"> | string
    nome?: StringFilter<"Pessoa"> | string
    email?: StringFilter<"Pessoa"> | string
    email_hash?: StringFilter<"Pessoa"> | string
    email_confirmado?: BoolFilter<"Pessoa"> | boolean
    codigo_confirmacao?: StringNullableFilter<"Pessoa"> | string | null
    codigo_confirmacao_hash?: StringNullableFilter<"Pessoa"> | string | null
    codigo_expiracao?: DateTimeNullableFilter<"Pessoa"> | Date | string | null
    senha?: StringFilter<"Pessoa"> | string
    inativo?: BoolFilter<"Pessoa"> | boolean
    data_criacao?: DateTimeFilter<"Pessoa"> | Date | string
    participacoes?: ParticipanteSalaListRelationFilter
    salasCriadas?: SalaListRelationFilter
    votos?: VotoListRelationFilter
  }

  export type PessoaOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    email_hash?: SortOrder
    email_confirmado?: SortOrder
    codigo_confirmacao?: SortOrderInput | SortOrder
    codigo_confirmacao_hash?: SortOrderInput | SortOrder
    codigo_expiracao?: SortOrderInput | SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    participacoes?: ParticipanteSalaOrderByRelationAggregateInput
    salasCriadas?: SalaOrderByRelationAggregateInput
    votos?: VotoOrderByRelationAggregateInput
  }

  export type PessoaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    email_hash?: string
    codigo_confirmacao?: string
    codigo_confirmacao_hash?: string
    AND?: PessoaWhereInput | PessoaWhereInput[]
    OR?: PessoaWhereInput[]
    NOT?: PessoaWhereInput | PessoaWhereInput[]
    nome?: StringFilter<"Pessoa"> | string
    email_confirmado?: BoolFilter<"Pessoa"> | boolean
    codigo_expiracao?: DateTimeNullableFilter<"Pessoa"> | Date | string | null
    senha?: StringFilter<"Pessoa"> | string
    inativo?: BoolFilter<"Pessoa"> | boolean
    data_criacao?: DateTimeFilter<"Pessoa"> | Date | string
    participacoes?: ParticipanteSalaListRelationFilter
    salasCriadas?: SalaListRelationFilter
    votos?: VotoListRelationFilter
  }, "id" | "email" | "email_hash" | "codigo_confirmacao" | "codigo_confirmacao_hash">

  export type PessoaOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    email_hash?: SortOrder
    email_confirmado?: SortOrder
    codigo_confirmacao?: SortOrderInput | SortOrder
    codigo_confirmacao_hash?: SortOrderInput | SortOrder
    codigo_expiracao?: SortOrderInput | SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    _count?: PessoaCountOrderByAggregateInput
    _max?: PessoaMaxOrderByAggregateInput
    _min?: PessoaMinOrderByAggregateInput
  }

  export type PessoaScalarWhereWithAggregatesInput = {
    AND?: PessoaScalarWhereWithAggregatesInput | PessoaScalarWhereWithAggregatesInput[]
    OR?: PessoaScalarWhereWithAggregatesInput[]
    NOT?: PessoaScalarWhereWithAggregatesInput | PessoaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pessoa"> | string
    nome?: StringWithAggregatesFilter<"Pessoa"> | string
    email?: StringWithAggregatesFilter<"Pessoa"> | string
    email_hash?: StringWithAggregatesFilter<"Pessoa"> | string
    email_confirmado?: BoolWithAggregatesFilter<"Pessoa"> | boolean
    codigo_confirmacao?: StringNullableWithAggregatesFilter<"Pessoa"> | string | null
    codigo_confirmacao_hash?: StringNullableWithAggregatesFilter<"Pessoa"> | string | null
    codigo_expiracao?: DateTimeNullableWithAggregatesFilter<"Pessoa"> | Date | string | null
    senha?: StringWithAggregatesFilter<"Pessoa"> | string
    inativo?: BoolWithAggregatesFilter<"Pessoa"> | boolean
    data_criacao?: DateTimeWithAggregatesFilter<"Pessoa"> | Date | string
  }

  export type SalaWhereInput = {
    AND?: SalaWhereInput | SalaWhereInput[]
    OR?: SalaWhereInput[]
    NOT?: SalaWhereInput | SalaWhereInput[]
    id?: StringFilter<"Sala"> | string
    codigo?: IntFilter<"Sala"> | number
    titulo?: StringFilter<"Sala"> | string
    criado_por?: StringFilter<"Sala"> | string
    senha?: StringNullableFilter<"Sala"> | string | null
    inativo?: BoolFilter<"Sala"> | boolean
    data_criacao?: DateTimeFilter<"Sala"> | Date | string
    data_alteracao?: DateTimeFilter<"Sala"> | Date | string
    participantes?: ParticipanteSalaListRelationFilter
    proprietario?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    votos?: VotoListRelationFilter
  }

  export type SalaOrderByWithRelationInput = {
    id?: SortOrder
    codigo?: SortOrder
    titulo?: SortOrder
    criado_por?: SortOrder
    senha?: SortOrderInput | SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    data_alteracao?: SortOrder
    participantes?: ParticipanteSalaOrderByRelationAggregateInput
    proprietario?: PessoaOrderByWithRelationInput
    votos?: VotoOrderByRelationAggregateInput
  }

  export type SalaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    codigo?: number
    AND?: SalaWhereInput | SalaWhereInput[]
    OR?: SalaWhereInput[]
    NOT?: SalaWhereInput | SalaWhereInput[]
    titulo?: StringFilter<"Sala"> | string
    criado_por?: StringFilter<"Sala"> | string
    senha?: StringNullableFilter<"Sala"> | string | null
    inativo?: BoolFilter<"Sala"> | boolean
    data_criacao?: DateTimeFilter<"Sala"> | Date | string
    data_alteracao?: DateTimeFilter<"Sala"> | Date | string
    participantes?: ParticipanteSalaListRelationFilter
    proprietario?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    votos?: VotoListRelationFilter
  }, "id" | "codigo">

  export type SalaOrderByWithAggregationInput = {
    id?: SortOrder
    codigo?: SortOrder
    titulo?: SortOrder
    criado_por?: SortOrder
    senha?: SortOrderInput | SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    data_alteracao?: SortOrder
    _count?: SalaCountOrderByAggregateInput
    _avg?: SalaAvgOrderByAggregateInput
    _max?: SalaMaxOrderByAggregateInput
    _min?: SalaMinOrderByAggregateInput
    _sum?: SalaSumOrderByAggregateInput
  }

  export type SalaScalarWhereWithAggregatesInput = {
    AND?: SalaScalarWhereWithAggregatesInput | SalaScalarWhereWithAggregatesInput[]
    OR?: SalaScalarWhereWithAggregatesInput[]
    NOT?: SalaScalarWhereWithAggregatesInput | SalaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sala"> | string
    codigo?: IntWithAggregatesFilter<"Sala"> | number
    titulo?: StringWithAggregatesFilter<"Sala"> | string
    criado_por?: StringWithAggregatesFilter<"Sala"> | string
    senha?: StringNullableWithAggregatesFilter<"Sala"> | string | null
    inativo?: BoolWithAggregatesFilter<"Sala"> | boolean
    data_criacao?: DateTimeWithAggregatesFilter<"Sala"> | Date | string
    data_alteracao?: DateTimeWithAggregatesFilter<"Sala"> | Date | string
  }

  export type ParticipanteSalaWhereInput = {
    AND?: ParticipanteSalaWhereInput | ParticipanteSalaWhereInput[]
    OR?: ParticipanteSalaWhereInput[]
    NOT?: ParticipanteSalaWhereInput | ParticipanteSalaWhereInput[]
    id?: StringFilter<"ParticipanteSala"> | string
    sala_id?: StringFilter<"ParticipanteSala"> | string
    pessoa_id?: StringFilter<"ParticipanteSala"> | string
    adicionado?: DateTimeFilter<"ParticipanteSala"> | Date | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    sala?: XOR<SalaScalarRelationFilter, SalaWhereInput>
  }

  export type ParticipanteSalaOrderByWithRelationInput = {
    id?: SortOrder
    sala_id?: SortOrder
    pessoa_id?: SortOrder
    adicionado?: SortOrder
    pessoa?: PessoaOrderByWithRelationInput
    sala?: SalaOrderByWithRelationInput
  }

  export type ParticipanteSalaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sala_id_pessoa_id?: ParticipanteSalaSala_idPessoa_idCompoundUniqueInput
    AND?: ParticipanteSalaWhereInput | ParticipanteSalaWhereInput[]
    OR?: ParticipanteSalaWhereInput[]
    NOT?: ParticipanteSalaWhereInput | ParticipanteSalaWhereInput[]
    sala_id?: StringFilter<"ParticipanteSala"> | string
    pessoa_id?: StringFilter<"ParticipanteSala"> | string
    adicionado?: DateTimeFilter<"ParticipanteSala"> | Date | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    sala?: XOR<SalaScalarRelationFilter, SalaWhereInput>
  }, "id" | "sala_id_pessoa_id">

  export type ParticipanteSalaOrderByWithAggregationInput = {
    id?: SortOrder
    sala_id?: SortOrder
    pessoa_id?: SortOrder
    adicionado?: SortOrder
    _count?: ParticipanteSalaCountOrderByAggregateInput
    _max?: ParticipanteSalaMaxOrderByAggregateInput
    _min?: ParticipanteSalaMinOrderByAggregateInput
  }

  export type ParticipanteSalaScalarWhereWithAggregatesInput = {
    AND?: ParticipanteSalaScalarWhereWithAggregatesInput | ParticipanteSalaScalarWhereWithAggregatesInput[]
    OR?: ParticipanteSalaScalarWhereWithAggregatesInput[]
    NOT?: ParticipanteSalaScalarWhereWithAggregatesInput | ParticipanteSalaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ParticipanteSala"> | string
    sala_id?: StringWithAggregatesFilter<"ParticipanteSala"> | string
    pessoa_id?: StringWithAggregatesFilter<"ParticipanteSala"> | string
    adicionado?: DateTimeWithAggregatesFilter<"ParticipanteSala"> | Date | string
  }

  export type VotoWhereInput = {
    AND?: VotoWhereInput | VotoWhereInput[]
    OR?: VotoWhereInput[]
    NOT?: VotoWhereInput | VotoWhereInput[]
    id?: StringFilter<"Voto"> | string
    pessoa_id?: StringFilter<"Voto"> | string
    sala_id?: StringFilter<"Voto"> | string
    valor?: IntFilter<"Voto"> | number
    data_voto?: DateTimeFilter<"Voto"> | Date | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    sala?: XOR<SalaScalarRelationFilter, SalaWhereInput>
  }

  export type VotoOrderByWithRelationInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    sala_id?: SortOrder
    valor?: SortOrder
    data_voto?: SortOrder
    pessoa?: PessoaOrderByWithRelationInput
    sala?: SalaOrderByWithRelationInput
  }

  export type VotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sala_id_pessoa_id?: VotoSala_idPessoa_idCompoundUniqueInput
    AND?: VotoWhereInput | VotoWhereInput[]
    OR?: VotoWhereInput[]
    NOT?: VotoWhereInput | VotoWhereInput[]
    pessoa_id?: StringFilter<"Voto"> | string
    sala_id?: StringFilter<"Voto"> | string
    valor?: IntFilter<"Voto"> | number
    data_voto?: DateTimeFilter<"Voto"> | Date | string
    pessoa?: XOR<PessoaScalarRelationFilter, PessoaWhereInput>
    sala?: XOR<SalaScalarRelationFilter, SalaWhereInput>
  }, "id" | "sala_id_pessoa_id">

  export type VotoOrderByWithAggregationInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    sala_id?: SortOrder
    valor?: SortOrder
    data_voto?: SortOrder
    _count?: VotoCountOrderByAggregateInput
    _avg?: VotoAvgOrderByAggregateInput
    _max?: VotoMaxOrderByAggregateInput
    _min?: VotoMinOrderByAggregateInput
    _sum?: VotoSumOrderByAggregateInput
  }

  export type VotoScalarWhereWithAggregatesInput = {
    AND?: VotoScalarWhereWithAggregatesInput | VotoScalarWhereWithAggregatesInput[]
    OR?: VotoScalarWhereWithAggregatesInput[]
    NOT?: VotoScalarWhereWithAggregatesInput | VotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Voto"> | string
    pessoa_id?: StringWithAggregatesFilter<"Voto"> | string
    sala_id?: StringWithAggregatesFilter<"Voto"> | string
    valor?: IntWithAggregatesFilter<"Voto"> | number
    data_voto?: DateTimeWithAggregatesFilter<"Voto"> | Date | string
  }

  export type PessoaCreateInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    participacoes?: ParticipanteSalaCreateNestedManyWithoutPessoaInput
    salasCriadas?: SalaCreateNestedManyWithoutProprietarioInput
    votos?: VotoCreateNestedManyWithoutPessoaInput
  }

  export type PessoaUncheckedCreateInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    participacoes?: ParticipanteSalaUncheckedCreateNestedManyWithoutPessoaInput
    salasCriadas?: SalaUncheckedCreateNestedManyWithoutProprietarioInput
    votos?: VotoUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    participacoes?: ParticipanteSalaUpdateManyWithoutPessoaNestedInput
    salasCriadas?: SalaUpdateManyWithoutProprietarioNestedInput
    votos?: VotoUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    participacoes?: ParticipanteSalaUncheckedUpdateManyWithoutPessoaNestedInput
    salasCriadas?: SalaUncheckedUpdateManyWithoutProprietarioNestedInput
    votos?: VotoUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaCreateManyInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
  }

  export type PessoaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PessoaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalaCreateInput = {
    id?: string
    codigo: number
    titulo: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    participantes?: ParticipanteSalaCreateNestedManyWithoutSalaInput
    proprietario: PessoaCreateNestedOneWithoutSalasCriadasInput
    votos?: VotoCreateNestedManyWithoutSalaInput
  }

  export type SalaUncheckedCreateInput = {
    id?: string
    codigo: number
    titulo: string
    criado_por: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    participantes?: ParticipanteSalaUncheckedCreateNestedManyWithoutSalaInput
    votos?: VotoUncheckedCreateNestedManyWithoutSalaInput
  }

  export type SalaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    participantes?: ParticipanteSalaUpdateManyWithoutSalaNestedInput
    proprietario?: PessoaUpdateOneRequiredWithoutSalasCriadasNestedInput
    votos?: VotoUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    criado_por?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    participantes?: ParticipanteSalaUncheckedUpdateManyWithoutSalaNestedInput
    votos?: VotoUncheckedUpdateManyWithoutSalaNestedInput
  }

  export type SalaCreateManyInput = {
    id?: string
    codigo: number
    titulo: string
    criado_por: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
  }

  export type SalaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    criado_por?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipanteSalaCreateInput = {
    id?: string
    adicionado?: Date | string
    pessoa: PessoaCreateNestedOneWithoutParticipacoesInput
    sala: SalaCreateNestedOneWithoutParticipantesInput
  }

  export type ParticipanteSalaUncheckedCreateInput = {
    id?: string
    sala_id: string
    pessoa_id: string
    adicionado?: Date | string
  }

  export type ParticipanteSalaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
    pessoa?: PessoaUpdateOneRequiredWithoutParticipacoesNestedInput
    sala?: SalaUpdateOneRequiredWithoutParticipantesNestedInput
  }

  export type ParticipanteSalaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipanteSalaCreateManyInput = {
    id?: string
    sala_id: string
    pessoa_id: string
    adicionado?: Date | string
  }

  export type ParticipanteSalaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipanteSalaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoCreateInput = {
    id?: string
    valor: number
    data_voto?: Date | string
    pessoa: PessoaCreateNestedOneWithoutVotosInput
    sala: SalaCreateNestedOneWithoutVotosInput
  }

  export type VotoUncheckedCreateInput = {
    id?: string
    pessoa_id: string
    sala_id: string
    valor: number
    data_voto?: Date | string
  }

  export type VotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
    pessoa?: PessoaUpdateOneRequiredWithoutVotosNestedInput
    sala?: SalaUpdateOneRequiredWithoutVotosNestedInput
  }

  export type VotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoCreateManyInput = {
    id?: string
    pessoa_id: string
    sala_id: string
    valor: number
    data_voto?: Date | string
  }

  export type VotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ParticipanteSalaListRelationFilter = {
    every?: ParticipanteSalaWhereInput
    some?: ParticipanteSalaWhereInput
    none?: ParticipanteSalaWhereInput
  }

  export type SalaListRelationFilter = {
    every?: SalaWhereInput
    some?: SalaWhereInput
    none?: SalaWhereInput
  }

  export type VotoListRelationFilter = {
    every?: VotoWhereInput
    some?: VotoWhereInput
    none?: VotoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ParticipanteSalaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SalaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PessoaCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    email_hash?: SortOrder
    email_confirmado?: SortOrder
    codigo_confirmacao?: SortOrder
    codigo_confirmacao_hash?: SortOrder
    codigo_expiracao?: SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
  }

  export type PessoaMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    email_hash?: SortOrder
    email_confirmado?: SortOrder
    codigo_confirmacao?: SortOrder
    codigo_confirmacao_hash?: SortOrder
    codigo_expiracao?: SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
  }

  export type PessoaMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    email_hash?: SortOrder
    email_confirmado?: SortOrder
    codigo_confirmacao?: SortOrder
    codigo_confirmacao_hash?: SortOrder
    codigo_expiracao?: SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PessoaScalarRelationFilter = {
    is?: PessoaWhereInput
    isNot?: PessoaWhereInput
  }

  export type SalaCountOrderByAggregateInput = {
    id?: SortOrder
    codigo?: SortOrder
    titulo?: SortOrder
    criado_por?: SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    data_alteracao?: SortOrder
  }

  export type SalaAvgOrderByAggregateInput = {
    codigo?: SortOrder
  }

  export type SalaMaxOrderByAggregateInput = {
    id?: SortOrder
    codigo?: SortOrder
    titulo?: SortOrder
    criado_por?: SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    data_alteracao?: SortOrder
  }

  export type SalaMinOrderByAggregateInput = {
    id?: SortOrder
    codigo?: SortOrder
    titulo?: SortOrder
    criado_por?: SortOrder
    senha?: SortOrder
    inativo?: SortOrder
    data_criacao?: SortOrder
    data_alteracao?: SortOrder
  }

  export type SalaSumOrderByAggregateInput = {
    codigo?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type SalaScalarRelationFilter = {
    is?: SalaWhereInput
    isNot?: SalaWhereInput
  }

  export type ParticipanteSalaSala_idPessoa_idCompoundUniqueInput = {
    sala_id: string
    pessoa_id: string
  }

  export type ParticipanteSalaCountOrderByAggregateInput = {
    id?: SortOrder
    sala_id?: SortOrder
    pessoa_id?: SortOrder
    adicionado?: SortOrder
  }

  export type ParticipanteSalaMaxOrderByAggregateInput = {
    id?: SortOrder
    sala_id?: SortOrder
    pessoa_id?: SortOrder
    adicionado?: SortOrder
  }

  export type ParticipanteSalaMinOrderByAggregateInput = {
    id?: SortOrder
    sala_id?: SortOrder
    pessoa_id?: SortOrder
    adicionado?: SortOrder
  }

  export type VotoSala_idPessoa_idCompoundUniqueInput = {
    sala_id: string
    pessoa_id: string
  }

  export type VotoCountOrderByAggregateInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    sala_id?: SortOrder
    valor?: SortOrder
    data_voto?: SortOrder
  }

  export type VotoAvgOrderByAggregateInput = {
    valor?: SortOrder
  }

  export type VotoMaxOrderByAggregateInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    sala_id?: SortOrder
    valor?: SortOrder
    data_voto?: SortOrder
  }

  export type VotoMinOrderByAggregateInput = {
    id?: SortOrder
    pessoa_id?: SortOrder
    sala_id?: SortOrder
    valor?: SortOrder
    data_voto?: SortOrder
  }

  export type VotoSumOrderByAggregateInput = {
    valor?: SortOrder
  }

  export type ParticipanteSalaCreateNestedManyWithoutPessoaInput = {
    create?: XOR<ParticipanteSalaCreateWithoutPessoaInput, ParticipanteSalaUncheckedCreateWithoutPessoaInput> | ParticipanteSalaCreateWithoutPessoaInput[] | ParticipanteSalaUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutPessoaInput | ParticipanteSalaCreateOrConnectWithoutPessoaInput[]
    createMany?: ParticipanteSalaCreateManyPessoaInputEnvelope
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
  }

  export type SalaCreateNestedManyWithoutProprietarioInput = {
    create?: XOR<SalaCreateWithoutProprietarioInput, SalaUncheckedCreateWithoutProprietarioInput> | SalaCreateWithoutProprietarioInput[] | SalaUncheckedCreateWithoutProprietarioInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutProprietarioInput | SalaCreateOrConnectWithoutProprietarioInput[]
    createMany?: SalaCreateManyProprietarioInputEnvelope
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
  }

  export type VotoCreateNestedManyWithoutPessoaInput = {
    create?: XOR<VotoCreateWithoutPessoaInput, VotoUncheckedCreateWithoutPessoaInput> | VotoCreateWithoutPessoaInput[] | VotoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutPessoaInput | VotoCreateOrConnectWithoutPessoaInput[]
    createMany?: VotoCreateManyPessoaInputEnvelope
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
  }

  export type ParticipanteSalaUncheckedCreateNestedManyWithoutPessoaInput = {
    create?: XOR<ParticipanteSalaCreateWithoutPessoaInput, ParticipanteSalaUncheckedCreateWithoutPessoaInput> | ParticipanteSalaCreateWithoutPessoaInput[] | ParticipanteSalaUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutPessoaInput | ParticipanteSalaCreateOrConnectWithoutPessoaInput[]
    createMany?: ParticipanteSalaCreateManyPessoaInputEnvelope
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
  }

  export type SalaUncheckedCreateNestedManyWithoutProprietarioInput = {
    create?: XOR<SalaCreateWithoutProprietarioInput, SalaUncheckedCreateWithoutProprietarioInput> | SalaCreateWithoutProprietarioInput[] | SalaUncheckedCreateWithoutProprietarioInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutProprietarioInput | SalaCreateOrConnectWithoutProprietarioInput[]
    createMany?: SalaCreateManyProprietarioInputEnvelope
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
  }

  export type VotoUncheckedCreateNestedManyWithoutPessoaInput = {
    create?: XOR<VotoCreateWithoutPessoaInput, VotoUncheckedCreateWithoutPessoaInput> | VotoCreateWithoutPessoaInput[] | VotoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutPessoaInput | VotoCreateOrConnectWithoutPessoaInput[]
    createMany?: VotoCreateManyPessoaInputEnvelope
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ParticipanteSalaUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<ParticipanteSalaCreateWithoutPessoaInput, ParticipanteSalaUncheckedCreateWithoutPessoaInput> | ParticipanteSalaCreateWithoutPessoaInput[] | ParticipanteSalaUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutPessoaInput | ParticipanteSalaCreateOrConnectWithoutPessoaInput[]
    upsert?: ParticipanteSalaUpsertWithWhereUniqueWithoutPessoaInput | ParticipanteSalaUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: ParticipanteSalaCreateManyPessoaInputEnvelope
    set?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    disconnect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    delete?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    update?: ParticipanteSalaUpdateWithWhereUniqueWithoutPessoaInput | ParticipanteSalaUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: ParticipanteSalaUpdateManyWithWhereWithoutPessoaInput | ParticipanteSalaUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: ParticipanteSalaScalarWhereInput | ParticipanteSalaScalarWhereInput[]
  }

  export type SalaUpdateManyWithoutProprietarioNestedInput = {
    create?: XOR<SalaCreateWithoutProprietarioInput, SalaUncheckedCreateWithoutProprietarioInput> | SalaCreateWithoutProprietarioInput[] | SalaUncheckedCreateWithoutProprietarioInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutProprietarioInput | SalaCreateOrConnectWithoutProprietarioInput[]
    upsert?: SalaUpsertWithWhereUniqueWithoutProprietarioInput | SalaUpsertWithWhereUniqueWithoutProprietarioInput[]
    createMany?: SalaCreateManyProprietarioInputEnvelope
    set?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    disconnect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    delete?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    update?: SalaUpdateWithWhereUniqueWithoutProprietarioInput | SalaUpdateWithWhereUniqueWithoutProprietarioInput[]
    updateMany?: SalaUpdateManyWithWhereWithoutProprietarioInput | SalaUpdateManyWithWhereWithoutProprietarioInput[]
    deleteMany?: SalaScalarWhereInput | SalaScalarWhereInput[]
  }

  export type VotoUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<VotoCreateWithoutPessoaInput, VotoUncheckedCreateWithoutPessoaInput> | VotoCreateWithoutPessoaInput[] | VotoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutPessoaInput | VotoCreateOrConnectWithoutPessoaInput[]
    upsert?: VotoUpsertWithWhereUniqueWithoutPessoaInput | VotoUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: VotoCreateManyPessoaInputEnvelope
    set?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    disconnect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    delete?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    update?: VotoUpdateWithWhereUniqueWithoutPessoaInput | VotoUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: VotoUpdateManyWithWhereWithoutPessoaInput | VotoUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: VotoScalarWhereInput | VotoScalarWhereInput[]
  }

  export type ParticipanteSalaUncheckedUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<ParticipanteSalaCreateWithoutPessoaInput, ParticipanteSalaUncheckedCreateWithoutPessoaInput> | ParticipanteSalaCreateWithoutPessoaInput[] | ParticipanteSalaUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutPessoaInput | ParticipanteSalaCreateOrConnectWithoutPessoaInput[]
    upsert?: ParticipanteSalaUpsertWithWhereUniqueWithoutPessoaInput | ParticipanteSalaUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: ParticipanteSalaCreateManyPessoaInputEnvelope
    set?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    disconnect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    delete?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    update?: ParticipanteSalaUpdateWithWhereUniqueWithoutPessoaInput | ParticipanteSalaUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: ParticipanteSalaUpdateManyWithWhereWithoutPessoaInput | ParticipanteSalaUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: ParticipanteSalaScalarWhereInput | ParticipanteSalaScalarWhereInput[]
  }

  export type SalaUncheckedUpdateManyWithoutProprietarioNestedInput = {
    create?: XOR<SalaCreateWithoutProprietarioInput, SalaUncheckedCreateWithoutProprietarioInput> | SalaCreateWithoutProprietarioInput[] | SalaUncheckedCreateWithoutProprietarioInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutProprietarioInput | SalaCreateOrConnectWithoutProprietarioInput[]
    upsert?: SalaUpsertWithWhereUniqueWithoutProprietarioInput | SalaUpsertWithWhereUniqueWithoutProprietarioInput[]
    createMany?: SalaCreateManyProprietarioInputEnvelope
    set?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    disconnect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    delete?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    update?: SalaUpdateWithWhereUniqueWithoutProprietarioInput | SalaUpdateWithWhereUniqueWithoutProprietarioInput[]
    updateMany?: SalaUpdateManyWithWhereWithoutProprietarioInput | SalaUpdateManyWithWhereWithoutProprietarioInput[]
    deleteMany?: SalaScalarWhereInput | SalaScalarWhereInput[]
  }

  export type VotoUncheckedUpdateManyWithoutPessoaNestedInput = {
    create?: XOR<VotoCreateWithoutPessoaInput, VotoUncheckedCreateWithoutPessoaInput> | VotoCreateWithoutPessoaInput[] | VotoUncheckedCreateWithoutPessoaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutPessoaInput | VotoCreateOrConnectWithoutPessoaInput[]
    upsert?: VotoUpsertWithWhereUniqueWithoutPessoaInput | VotoUpsertWithWhereUniqueWithoutPessoaInput[]
    createMany?: VotoCreateManyPessoaInputEnvelope
    set?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    disconnect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    delete?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    update?: VotoUpdateWithWhereUniqueWithoutPessoaInput | VotoUpdateWithWhereUniqueWithoutPessoaInput[]
    updateMany?: VotoUpdateManyWithWhereWithoutPessoaInput | VotoUpdateManyWithWhereWithoutPessoaInput[]
    deleteMany?: VotoScalarWhereInput | VotoScalarWhereInput[]
  }

  export type ParticipanteSalaCreateNestedManyWithoutSalaInput = {
    create?: XOR<ParticipanteSalaCreateWithoutSalaInput, ParticipanteSalaUncheckedCreateWithoutSalaInput> | ParticipanteSalaCreateWithoutSalaInput[] | ParticipanteSalaUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutSalaInput | ParticipanteSalaCreateOrConnectWithoutSalaInput[]
    createMany?: ParticipanteSalaCreateManySalaInputEnvelope
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
  }

  export type PessoaCreateNestedOneWithoutSalasCriadasInput = {
    create?: XOR<PessoaCreateWithoutSalasCriadasInput, PessoaUncheckedCreateWithoutSalasCriadasInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutSalasCriadasInput
    connect?: PessoaWhereUniqueInput
  }

  export type VotoCreateNestedManyWithoutSalaInput = {
    create?: XOR<VotoCreateWithoutSalaInput, VotoUncheckedCreateWithoutSalaInput> | VotoCreateWithoutSalaInput[] | VotoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutSalaInput | VotoCreateOrConnectWithoutSalaInput[]
    createMany?: VotoCreateManySalaInputEnvelope
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
  }

  export type ParticipanteSalaUncheckedCreateNestedManyWithoutSalaInput = {
    create?: XOR<ParticipanteSalaCreateWithoutSalaInput, ParticipanteSalaUncheckedCreateWithoutSalaInput> | ParticipanteSalaCreateWithoutSalaInput[] | ParticipanteSalaUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutSalaInput | ParticipanteSalaCreateOrConnectWithoutSalaInput[]
    createMany?: ParticipanteSalaCreateManySalaInputEnvelope
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
  }

  export type VotoUncheckedCreateNestedManyWithoutSalaInput = {
    create?: XOR<VotoCreateWithoutSalaInput, VotoUncheckedCreateWithoutSalaInput> | VotoCreateWithoutSalaInput[] | VotoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutSalaInput | VotoCreateOrConnectWithoutSalaInput[]
    createMany?: VotoCreateManySalaInputEnvelope
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ParticipanteSalaUpdateManyWithoutSalaNestedInput = {
    create?: XOR<ParticipanteSalaCreateWithoutSalaInput, ParticipanteSalaUncheckedCreateWithoutSalaInput> | ParticipanteSalaCreateWithoutSalaInput[] | ParticipanteSalaUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutSalaInput | ParticipanteSalaCreateOrConnectWithoutSalaInput[]
    upsert?: ParticipanteSalaUpsertWithWhereUniqueWithoutSalaInput | ParticipanteSalaUpsertWithWhereUniqueWithoutSalaInput[]
    createMany?: ParticipanteSalaCreateManySalaInputEnvelope
    set?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    disconnect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    delete?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    update?: ParticipanteSalaUpdateWithWhereUniqueWithoutSalaInput | ParticipanteSalaUpdateWithWhereUniqueWithoutSalaInput[]
    updateMany?: ParticipanteSalaUpdateManyWithWhereWithoutSalaInput | ParticipanteSalaUpdateManyWithWhereWithoutSalaInput[]
    deleteMany?: ParticipanteSalaScalarWhereInput | ParticipanteSalaScalarWhereInput[]
  }

  export type PessoaUpdateOneRequiredWithoutSalasCriadasNestedInput = {
    create?: XOR<PessoaCreateWithoutSalasCriadasInput, PessoaUncheckedCreateWithoutSalasCriadasInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutSalasCriadasInput
    upsert?: PessoaUpsertWithoutSalasCriadasInput
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutSalasCriadasInput, PessoaUpdateWithoutSalasCriadasInput>, PessoaUncheckedUpdateWithoutSalasCriadasInput>
  }

  export type VotoUpdateManyWithoutSalaNestedInput = {
    create?: XOR<VotoCreateWithoutSalaInput, VotoUncheckedCreateWithoutSalaInput> | VotoCreateWithoutSalaInput[] | VotoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutSalaInput | VotoCreateOrConnectWithoutSalaInput[]
    upsert?: VotoUpsertWithWhereUniqueWithoutSalaInput | VotoUpsertWithWhereUniqueWithoutSalaInput[]
    createMany?: VotoCreateManySalaInputEnvelope
    set?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    disconnect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    delete?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    update?: VotoUpdateWithWhereUniqueWithoutSalaInput | VotoUpdateWithWhereUniqueWithoutSalaInput[]
    updateMany?: VotoUpdateManyWithWhereWithoutSalaInput | VotoUpdateManyWithWhereWithoutSalaInput[]
    deleteMany?: VotoScalarWhereInput | VotoScalarWhereInput[]
  }

  export type ParticipanteSalaUncheckedUpdateManyWithoutSalaNestedInput = {
    create?: XOR<ParticipanteSalaCreateWithoutSalaInput, ParticipanteSalaUncheckedCreateWithoutSalaInput> | ParticipanteSalaCreateWithoutSalaInput[] | ParticipanteSalaUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: ParticipanteSalaCreateOrConnectWithoutSalaInput | ParticipanteSalaCreateOrConnectWithoutSalaInput[]
    upsert?: ParticipanteSalaUpsertWithWhereUniqueWithoutSalaInput | ParticipanteSalaUpsertWithWhereUniqueWithoutSalaInput[]
    createMany?: ParticipanteSalaCreateManySalaInputEnvelope
    set?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    disconnect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    delete?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    connect?: ParticipanteSalaWhereUniqueInput | ParticipanteSalaWhereUniqueInput[]
    update?: ParticipanteSalaUpdateWithWhereUniqueWithoutSalaInput | ParticipanteSalaUpdateWithWhereUniqueWithoutSalaInput[]
    updateMany?: ParticipanteSalaUpdateManyWithWhereWithoutSalaInput | ParticipanteSalaUpdateManyWithWhereWithoutSalaInput[]
    deleteMany?: ParticipanteSalaScalarWhereInput | ParticipanteSalaScalarWhereInput[]
  }

  export type VotoUncheckedUpdateManyWithoutSalaNestedInput = {
    create?: XOR<VotoCreateWithoutSalaInput, VotoUncheckedCreateWithoutSalaInput> | VotoCreateWithoutSalaInput[] | VotoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: VotoCreateOrConnectWithoutSalaInput | VotoCreateOrConnectWithoutSalaInput[]
    upsert?: VotoUpsertWithWhereUniqueWithoutSalaInput | VotoUpsertWithWhereUniqueWithoutSalaInput[]
    createMany?: VotoCreateManySalaInputEnvelope
    set?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    disconnect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    delete?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    connect?: VotoWhereUniqueInput | VotoWhereUniqueInput[]
    update?: VotoUpdateWithWhereUniqueWithoutSalaInput | VotoUpdateWithWhereUniqueWithoutSalaInput[]
    updateMany?: VotoUpdateManyWithWhereWithoutSalaInput | VotoUpdateManyWithWhereWithoutSalaInput[]
    deleteMany?: VotoScalarWhereInput | VotoScalarWhereInput[]
  }

  export type PessoaCreateNestedOneWithoutParticipacoesInput = {
    create?: XOR<PessoaCreateWithoutParticipacoesInput, PessoaUncheckedCreateWithoutParticipacoesInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutParticipacoesInput
    connect?: PessoaWhereUniqueInput
  }

  export type SalaCreateNestedOneWithoutParticipantesInput = {
    create?: XOR<SalaCreateWithoutParticipantesInput, SalaUncheckedCreateWithoutParticipantesInput>
    connectOrCreate?: SalaCreateOrConnectWithoutParticipantesInput
    connect?: SalaWhereUniqueInput
  }

  export type PessoaUpdateOneRequiredWithoutParticipacoesNestedInput = {
    create?: XOR<PessoaCreateWithoutParticipacoesInput, PessoaUncheckedCreateWithoutParticipacoesInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutParticipacoesInput
    upsert?: PessoaUpsertWithoutParticipacoesInput
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutParticipacoesInput, PessoaUpdateWithoutParticipacoesInput>, PessoaUncheckedUpdateWithoutParticipacoesInput>
  }

  export type SalaUpdateOneRequiredWithoutParticipantesNestedInput = {
    create?: XOR<SalaCreateWithoutParticipantesInput, SalaUncheckedCreateWithoutParticipantesInput>
    connectOrCreate?: SalaCreateOrConnectWithoutParticipantesInput
    upsert?: SalaUpsertWithoutParticipantesInput
    connect?: SalaWhereUniqueInput
    update?: XOR<XOR<SalaUpdateToOneWithWhereWithoutParticipantesInput, SalaUpdateWithoutParticipantesInput>, SalaUncheckedUpdateWithoutParticipantesInput>
  }

  export type PessoaCreateNestedOneWithoutVotosInput = {
    create?: XOR<PessoaCreateWithoutVotosInput, PessoaUncheckedCreateWithoutVotosInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutVotosInput
    connect?: PessoaWhereUniqueInput
  }

  export type SalaCreateNestedOneWithoutVotosInput = {
    create?: XOR<SalaCreateWithoutVotosInput, SalaUncheckedCreateWithoutVotosInput>
    connectOrCreate?: SalaCreateOrConnectWithoutVotosInput
    connect?: SalaWhereUniqueInput
  }

  export type PessoaUpdateOneRequiredWithoutVotosNestedInput = {
    create?: XOR<PessoaCreateWithoutVotosInput, PessoaUncheckedCreateWithoutVotosInput>
    connectOrCreate?: PessoaCreateOrConnectWithoutVotosInput
    upsert?: PessoaUpsertWithoutVotosInput
    connect?: PessoaWhereUniqueInput
    update?: XOR<XOR<PessoaUpdateToOneWithWhereWithoutVotosInput, PessoaUpdateWithoutVotosInput>, PessoaUncheckedUpdateWithoutVotosInput>
  }

  export type SalaUpdateOneRequiredWithoutVotosNestedInput = {
    create?: XOR<SalaCreateWithoutVotosInput, SalaUncheckedCreateWithoutVotosInput>
    connectOrCreate?: SalaCreateOrConnectWithoutVotosInput
    upsert?: SalaUpsertWithoutVotosInput
    connect?: SalaWhereUniqueInput
    update?: XOR<XOR<SalaUpdateToOneWithWhereWithoutVotosInput, SalaUpdateWithoutVotosInput>, SalaUncheckedUpdateWithoutVotosInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ParticipanteSalaCreateWithoutPessoaInput = {
    id?: string
    adicionado?: Date | string
    sala: SalaCreateNestedOneWithoutParticipantesInput
  }

  export type ParticipanteSalaUncheckedCreateWithoutPessoaInput = {
    id?: string
    sala_id: string
    adicionado?: Date | string
  }

  export type ParticipanteSalaCreateOrConnectWithoutPessoaInput = {
    where: ParticipanteSalaWhereUniqueInput
    create: XOR<ParticipanteSalaCreateWithoutPessoaInput, ParticipanteSalaUncheckedCreateWithoutPessoaInput>
  }

  export type ParticipanteSalaCreateManyPessoaInputEnvelope = {
    data: ParticipanteSalaCreateManyPessoaInput | ParticipanteSalaCreateManyPessoaInput[]
    skipDuplicates?: boolean
  }

  export type SalaCreateWithoutProprietarioInput = {
    id?: string
    codigo: number
    titulo: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    participantes?: ParticipanteSalaCreateNestedManyWithoutSalaInput
    votos?: VotoCreateNestedManyWithoutSalaInput
  }

  export type SalaUncheckedCreateWithoutProprietarioInput = {
    id?: string
    codigo: number
    titulo: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    participantes?: ParticipanteSalaUncheckedCreateNestedManyWithoutSalaInput
    votos?: VotoUncheckedCreateNestedManyWithoutSalaInput
  }

  export type SalaCreateOrConnectWithoutProprietarioInput = {
    where: SalaWhereUniqueInput
    create: XOR<SalaCreateWithoutProprietarioInput, SalaUncheckedCreateWithoutProprietarioInput>
  }

  export type SalaCreateManyProprietarioInputEnvelope = {
    data: SalaCreateManyProprietarioInput | SalaCreateManyProprietarioInput[]
    skipDuplicates?: boolean
  }

  export type VotoCreateWithoutPessoaInput = {
    id?: string
    valor: number
    data_voto?: Date | string
    sala: SalaCreateNestedOneWithoutVotosInput
  }

  export type VotoUncheckedCreateWithoutPessoaInput = {
    id?: string
    sala_id: string
    valor: number
    data_voto?: Date | string
  }

  export type VotoCreateOrConnectWithoutPessoaInput = {
    where: VotoWhereUniqueInput
    create: XOR<VotoCreateWithoutPessoaInput, VotoUncheckedCreateWithoutPessoaInput>
  }

  export type VotoCreateManyPessoaInputEnvelope = {
    data: VotoCreateManyPessoaInput | VotoCreateManyPessoaInput[]
    skipDuplicates?: boolean
  }

  export type ParticipanteSalaUpsertWithWhereUniqueWithoutPessoaInput = {
    where: ParticipanteSalaWhereUniqueInput
    update: XOR<ParticipanteSalaUpdateWithoutPessoaInput, ParticipanteSalaUncheckedUpdateWithoutPessoaInput>
    create: XOR<ParticipanteSalaCreateWithoutPessoaInput, ParticipanteSalaUncheckedCreateWithoutPessoaInput>
  }

  export type ParticipanteSalaUpdateWithWhereUniqueWithoutPessoaInput = {
    where: ParticipanteSalaWhereUniqueInput
    data: XOR<ParticipanteSalaUpdateWithoutPessoaInput, ParticipanteSalaUncheckedUpdateWithoutPessoaInput>
  }

  export type ParticipanteSalaUpdateManyWithWhereWithoutPessoaInput = {
    where: ParticipanteSalaScalarWhereInput
    data: XOR<ParticipanteSalaUpdateManyMutationInput, ParticipanteSalaUncheckedUpdateManyWithoutPessoaInput>
  }

  export type ParticipanteSalaScalarWhereInput = {
    AND?: ParticipanteSalaScalarWhereInput | ParticipanteSalaScalarWhereInput[]
    OR?: ParticipanteSalaScalarWhereInput[]
    NOT?: ParticipanteSalaScalarWhereInput | ParticipanteSalaScalarWhereInput[]
    id?: StringFilter<"ParticipanteSala"> | string
    sala_id?: StringFilter<"ParticipanteSala"> | string
    pessoa_id?: StringFilter<"ParticipanteSala"> | string
    adicionado?: DateTimeFilter<"ParticipanteSala"> | Date | string
  }

  export type SalaUpsertWithWhereUniqueWithoutProprietarioInput = {
    where: SalaWhereUniqueInput
    update: XOR<SalaUpdateWithoutProprietarioInput, SalaUncheckedUpdateWithoutProprietarioInput>
    create: XOR<SalaCreateWithoutProprietarioInput, SalaUncheckedCreateWithoutProprietarioInput>
  }

  export type SalaUpdateWithWhereUniqueWithoutProprietarioInput = {
    where: SalaWhereUniqueInput
    data: XOR<SalaUpdateWithoutProprietarioInput, SalaUncheckedUpdateWithoutProprietarioInput>
  }

  export type SalaUpdateManyWithWhereWithoutProprietarioInput = {
    where: SalaScalarWhereInput
    data: XOR<SalaUpdateManyMutationInput, SalaUncheckedUpdateManyWithoutProprietarioInput>
  }

  export type SalaScalarWhereInput = {
    AND?: SalaScalarWhereInput | SalaScalarWhereInput[]
    OR?: SalaScalarWhereInput[]
    NOT?: SalaScalarWhereInput | SalaScalarWhereInput[]
    id?: StringFilter<"Sala"> | string
    codigo?: IntFilter<"Sala"> | number
    titulo?: StringFilter<"Sala"> | string
    criado_por?: StringFilter<"Sala"> | string
    senha?: StringNullableFilter<"Sala"> | string | null
    inativo?: BoolFilter<"Sala"> | boolean
    data_criacao?: DateTimeFilter<"Sala"> | Date | string
    data_alteracao?: DateTimeFilter<"Sala"> | Date | string
  }

  export type VotoUpsertWithWhereUniqueWithoutPessoaInput = {
    where: VotoWhereUniqueInput
    update: XOR<VotoUpdateWithoutPessoaInput, VotoUncheckedUpdateWithoutPessoaInput>
    create: XOR<VotoCreateWithoutPessoaInput, VotoUncheckedCreateWithoutPessoaInput>
  }

  export type VotoUpdateWithWhereUniqueWithoutPessoaInput = {
    where: VotoWhereUniqueInput
    data: XOR<VotoUpdateWithoutPessoaInput, VotoUncheckedUpdateWithoutPessoaInput>
  }

  export type VotoUpdateManyWithWhereWithoutPessoaInput = {
    where: VotoScalarWhereInput
    data: XOR<VotoUpdateManyMutationInput, VotoUncheckedUpdateManyWithoutPessoaInput>
  }

  export type VotoScalarWhereInput = {
    AND?: VotoScalarWhereInput | VotoScalarWhereInput[]
    OR?: VotoScalarWhereInput[]
    NOT?: VotoScalarWhereInput | VotoScalarWhereInput[]
    id?: StringFilter<"Voto"> | string
    pessoa_id?: StringFilter<"Voto"> | string
    sala_id?: StringFilter<"Voto"> | string
    valor?: IntFilter<"Voto"> | number
    data_voto?: DateTimeFilter<"Voto"> | Date | string
  }

  export type ParticipanteSalaCreateWithoutSalaInput = {
    id?: string
    adicionado?: Date | string
    pessoa: PessoaCreateNestedOneWithoutParticipacoesInput
  }

  export type ParticipanteSalaUncheckedCreateWithoutSalaInput = {
    id?: string
    pessoa_id: string
    adicionado?: Date | string
  }

  export type ParticipanteSalaCreateOrConnectWithoutSalaInput = {
    where: ParticipanteSalaWhereUniqueInput
    create: XOR<ParticipanteSalaCreateWithoutSalaInput, ParticipanteSalaUncheckedCreateWithoutSalaInput>
  }

  export type ParticipanteSalaCreateManySalaInputEnvelope = {
    data: ParticipanteSalaCreateManySalaInput | ParticipanteSalaCreateManySalaInput[]
    skipDuplicates?: boolean
  }

  export type PessoaCreateWithoutSalasCriadasInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    participacoes?: ParticipanteSalaCreateNestedManyWithoutPessoaInput
    votos?: VotoCreateNestedManyWithoutPessoaInput
  }

  export type PessoaUncheckedCreateWithoutSalasCriadasInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    participacoes?: ParticipanteSalaUncheckedCreateNestedManyWithoutPessoaInput
    votos?: VotoUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaCreateOrConnectWithoutSalasCriadasInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutSalasCriadasInput, PessoaUncheckedCreateWithoutSalasCriadasInput>
  }

  export type VotoCreateWithoutSalaInput = {
    id?: string
    valor: number
    data_voto?: Date | string
    pessoa: PessoaCreateNestedOneWithoutVotosInput
  }

  export type VotoUncheckedCreateWithoutSalaInput = {
    id?: string
    pessoa_id: string
    valor: number
    data_voto?: Date | string
  }

  export type VotoCreateOrConnectWithoutSalaInput = {
    where: VotoWhereUniqueInput
    create: XOR<VotoCreateWithoutSalaInput, VotoUncheckedCreateWithoutSalaInput>
  }

  export type VotoCreateManySalaInputEnvelope = {
    data: VotoCreateManySalaInput | VotoCreateManySalaInput[]
    skipDuplicates?: boolean
  }

  export type ParticipanteSalaUpsertWithWhereUniqueWithoutSalaInput = {
    where: ParticipanteSalaWhereUniqueInput
    update: XOR<ParticipanteSalaUpdateWithoutSalaInput, ParticipanteSalaUncheckedUpdateWithoutSalaInput>
    create: XOR<ParticipanteSalaCreateWithoutSalaInput, ParticipanteSalaUncheckedCreateWithoutSalaInput>
  }

  export type ParticipanteSalaUpdateWithWhereUniqueWithoutSalaInput = {
    where: ParticipanteSalaWhereUniqueInput
    data: XOR<ParticipanteSalaUpdateWithoutSalaInput, ParticipanteSalaUncheckedUpdateWithoutSalaInput>
  }

  export type ParticipanteSalaUpdateManyWithWhereWithoutSalaInput = {
    where: ParticipanteSalaScalarWhereInput
    data: XOR<ParticipanteSalaUpdateManyMutationInput, ParticipanteSalaUncheckedUpdateManyWithoutSalaInput>
  }

  export type PessoaUpsertWithoutSalasCriadasInput = {
    update: XOR<PessoaUpdateWithoutSalasCriadasInput, PessoaUncheckedUpdateWithoutSalasCriadasInput>
    create: XOR<PessoaCreateWithoutSalasCriadasInput, PessoaUncheckedCreateWithoutSalasCriadasInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutSalasCriadasInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutSalasCriadasInput, PessoaUncheckedUpdateWithoutSalasCriadasInput>
  }

  export type PessoaUpdateWithoutSalasCriadasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    participacoes?: ParticipanteSalaUpdateManyWithoutPessoaNestedInput
    votos?: VotoUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateWithoutSalasCriadasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    participacoes?: ParticipanteSalaUncheckedUpdateManyWithoutPessoaNestedInput
    votos?: VotoUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type VotoUpsertWithWhereUniqueWithoutSalaInput = {
    where: VotoWhereUniqueInput
    update: XOR<VotoUpdateWithoutSalaInput, VotoUncheckedUpdateWithoutSalaInput>
    create: XOR<VotoCreateWithoutSalaInput, VotoUncheckedCreateWithoutSalaInput>
  }

  export type VotoUpdateWithWhereUniqueWithoutSalaInput = {
    where: VotoWhereUniqueInput
    data: XOR<VotoUpdateWithoutSalaInput, VotoUncheckedUpdateWithoutSalaInput>
  }

  export type VotoUpdateManyWithWhereWithoutSalaInput = {
    where: VotoScalarWhereInput
    data: XOR<VotoUpdateManyMutationInput, VotoUncheckedUpdateManyWithoutSalaInput>
  }

  export type PessoaCreateWithoutParticipacoesInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    salasCriadas?: SalaCreateNestedManyWithoutProprietarioInput
    votos?: VotoCreateNestedManyWithoutPessoaInput
  }

  export type PessoaUncheckedCreateWithoutParticipacoesInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    salasCriadas?: SalaUncheckedCreateNestedManyWithoutProprietarioInput
    votos?: VotoUncheckedCreateNestedManyWithoutPessoaInput
  }

  export type PessoaCreateOrConnectWithoutParticipacoesInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutParticipacoesInput, PessoaUncheckedCreateWithoutParticipacoesInput>
  }

  export type SalaCreateWithoutParticipantesInput = {
    id?: string
    codigo: number
    titulo: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    proprietario: PessoaCreateNestedOneWithoutSalasCriadasInput
    votos?: VotoCreateNestedManyWithoutSalaInput
  }

  export type SalaUncheckedCreateWithoutParticipantesInput = {
    id?: string
    codigo: number
    titulo: string
    criado_por: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    votos?: VotoUncheckedCreateNestedManyWithoutSalaInput
  }

  export type SalaCreateOrConnectWithoutParticipantesInput = {
    where: SalaWhereUniqueInput
    create: XOR<SalaCreateWithoutParticipantesInput, SalaUncheckedCreateWithoutParticipantesInput>
  }

  export type PessoaUpsertWithoutParticipacoesInput = {
    update: XOR<PessoaUpdateWithoutParticipacoesInput, PessoaUncheckedUpdateWithoutParticipacoesInput>
    create: XOR<PessoaCreateWithoutParticipacoesInput, PessoaUncheckedCreateWithoutParticipacoesInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutParticipacoesInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutParticipacoesInput, PessoaUncheckedUpdateWithoutParticipacoesInput>
  }

  export type PessoaUpdateWithoutParticipacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    salasCriadas?: SalaUpdateManyWithoutProprietarioNestedInput
    votos?: VotoUpdateManyWithoutPessoaNestedInput
  }

  export type PessoaUncheckedUpdateWithoutParticipacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    salasCriadas?: SalaUncheckedUpdateManyWithoutProprietarioNestedInput
    votos?: VotoUncheckedUpdateManyWithoutPessoaNestedInput
  }

  export type SalaUpsertWithoutParticipantesInput = {
    update: XOR<SalaUpdateWithoutParticipantesInput, SalaUncheckedUpdateWithoutParticipantesInput>
    create: XOR<SalaCreateWithoutParticipantesInput, SalaUncheckedCreateWithoutParticipantesInput>
    where?: SalaWhereInput
  }

  export type SalaUpdateToOneWithWhereWithoutParticipantesInput = {
    where?: SalaWhereInput
    data: XOR<SalaUpdateWithoutParticipantesInput, SalaUncheckedUpdateWithoutParticipantesInput>
  }

  export type SalaUpdateWithoutParticipantesInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    proprietario?: PessoaUpdateOneRequiredWithoutSalasCriadasNestedInput
    votos?: VotoUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateWithoutParticipantesInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    criado_por?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    votos?: VotoUncheckedUpdateManyWithoutSalaNestedInput
  }

  export type PessoaCreateWithoutVotosInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    participacoes?: ParticipanteSalaCreateNestedManyWithoutPessoaInput
    salasCriadas?: SalaCreateNestedManyWithoutProprietarioInput
  }

  export type PessoaUncheckedCreateWithoutVotosInput = {
    id?: string
    nome: string
    email: string
    email_hash: string
    email_confirmado?: boolean
    codigo_confirmacao?: string | null
    codigo_confirmacao_hash?: string | null
    codigo_expiracao?: Date | string | null
    senha: string
    inativo?: boolean
    data_criacao?: Date | string
    participacoes?: ParticipanteSalaUncheckedCreateNestedManyWithoutPessoaInput
    salasCriadas?: SalaUncheckedCreateNestedManyWithoutProprietarioInput
  }

  export type PessoaCreateOrConnectWithoutVotosInput = {
    where: PessoaWhereUniqueInput
    create: XOR<PessoaCreateWithoutVotosInput, PessoaUncheckedCreateWithoutVotosInput>
  }

  export type SalaCreateWithoutVotosInput = {
    id?: string
    codigo: number
    titulo: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    participantes?: ParticipanteSalaCreateNestedManyWithoutSalaInput
    proprietario: PessoaCreateNestedOneWithoutSalasCriadasInput
  }

  export type SalaUncheckedCreateWithoutVotosInput = {
    id?: string
    codigo: number
    titulo: string
    criado_por: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
    participantes?: ParticipanteSalaUncheckedCreateNestedManyWithoutSalaInput
  }

  export type SalaCreateOrConnectWithoutVotosInput = {
    where: SalaWhereUniqueInput
    create: XOR<SalaCreateWithoutVotosInput, SalaUncheckedCreateWithoutVotosInput>
  }

  export type PessoaUpsertWithoutVotosInput = {
    update: XOR<PessoaUpdateWithoutVotosInput, PessoaUncheckedUpdateWithoutVotosInput>
    create: XOR<PessoaCreateWithoutVotosInput, PessoaUncheckedCreateWithoutVotosInput>
    where?: PessoaWhereInput
  }

  export type PessoaUpdateToOneWithWhereWithoutVotosInput = {
    where?: PessoaWhereInput
    data: XOR<PessoaUpdateWithoutVotosInput, PessoaUncheckedUpdateWithoutVotosInput>
  }

  export type PessoaUpdateWithoutVotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    participacoes?: ParticipanteSalaUpdateManyWithoutPessoaNestedInput
    salasCriadas?: SalaUpdateManyWithoutProprietarioNestedInput
  }

  export type PessoaUncheckedUpdateWithoutVotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    email_hash?: StringFieldUpdateOperationsInput | string
    email_confirmado?: BoolFieldUpdateOperationsInput | boolean
    codigo_confirmacao?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_confirmacao_hash?: NullableStringFieldUpdateOperationsInput | string | null
    codigo_expiracao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senha?: StringFieldUpdateOperationsInput | string
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    participacoes?: ParticipanteSalaUncheckedUpdateManyWithoutPessoaNestedInput
    salasCriadas?: SalaUncheckedUpdateManyWithoutProprietarioNestedInput
  }

  export type SalaUpsertWithoutVotosInput = {
    update: XOR<SalaUpdateWithoutVotosInput, SalaUncheckedUpdateWithoutVotosInput>
    create: XOR<SalaCreateWithoutVotosInput, SalaUncheckedCreateWithoutVotosInput>
    where?: SalaWhereInput
  }

  export type SalaUpdateToOneWithWhereWithoutVotosInput = {
    where?: SalaWhereInput
    data: XOR<SalaUpdateWithoutVotosInput, SalaUncheckedUpdateWithoutVotosInput>
  }

  export type SalaUpdateWithoutVotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    participantes?: ParticipanteSalaUpdateManyWithoutSalaNestedInput
    proprietario?: PessoaUpdateOneRequiredWithoutSalasCriadasNestedInput
  }

  export type SalaUncheckedUpdateWithoutVotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    criado_por?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    participantes?: ParticipanteSalaUncheckedUpdateManyWithoutSalaNestedInput
  }

  export type ParticipanteSalaCreateManyPessoaInput = {
    id?: string
    sala_id: string
    adicionado?: Date | string
  }

  export type SalaCreateManyProprietarioInput = {
    id?: string
    codigo: number
    titulo: string
    senha?: string | null
    inativo?: boolean
    data_criacao?: Date | string
    data_alteracao?: Date | string
  }

  export type VotoCreateManyPessoaInput = {
    id?: string
    sala_id: string
    valor: number
    data_voto?: Date | string
  }

  export type ParticipanteSalaUpdateWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
    sala?: SalaUpdateOneRequiredWithoutParticipantesNestedInput
  }

  export type ParticipanteSalaUncheckedUpdateWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipanteSalaUncheckedUpdateManyWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalaUpdateWithoutProprietarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    participantes?: ParticipanteSalaUpdateManyWithoutSalaNestedInput
    votos?: VotoUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateWithoutProprietarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
    participantes?: ParticipanteSalaUncheckedUpdateManyWithoutSalaNestedInput
    votos?: VotoUncheckedUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateManyWithoutProprietarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    senha?: NullableStringFieldUpdateOperationsInput | string | null
    inativo?: BoolFieldUpdateOperationsInput | boolean
    data_criacao?: DateTimeFieldUpdateOperationsInput | Date | string
    data_alteracao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoUpdateWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
    sala?: SalaUpdateOneRequiredWithoutVotosNestedInput
  }

  export type VotoUncheckedUpdateWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoUncheckedUpdateManyWithoutPessoaInput = {
    id?: StringFieldUpdateOperationsInput | string
    sala_id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipanteSalaCreateManySalaInput = {
    id?: string
    pessoa_id: string
    adicionado?: Date | string
  }

  export type VotoCreateManySalaInput = {
    id?: string
    pessoa_id: string
    valor: number
    data_voto?: Date | string
  }

  export type ParticipanteSalaUpdateWithoutSalaInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
    pessoa?: PessoaUpdateOneRequiredWithoutParticipacoesNestedInput
  }

  export type ParticipanteSalaUncheckedUpdateWithoutSalaInput = {
    id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipanteSalaUncheckedUpdateManyWithoutSalaInput = {
    id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    adicionado?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoUpdateWithoutSalaInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
    pessoa?: PessoaUpdateOneRequiredWithoutVotosNestedInput
  }

  export type VotoUncheckedUpdateWithoutSalaInput = {
    id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VotoUncheckedUpdateManyWithoutSalaInput = {
    id?: StringFieldUpdateOperationsInput | string
    pessoa_id?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    data_voto?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}