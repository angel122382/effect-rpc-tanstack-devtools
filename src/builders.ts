/**
 * RPC builders with mutation/query type annotations.
 *
 * This module re-exports Effect's Rpc and adds mutation() and query()
 * builder functions that automatically annotate RPCs with their type.
 *
 * @example
 * ```typescript
 * import { Rpc } from "@hazel/rpc-devtools"
 *
 * Rpc.mutation("channel.create", { payload: ..., success: ... })
 * Rpc.query("channel.list", { success: ... })
 * ```
 */
import { Rpc as EffectRpc } from "@effect/rpc"
import type * as RpcSchema from "@effect/rpc/RpcSchema"
import { Context, type Schema } from "effect"
import type { NoInfer } from "effect/Types"

/**
 * Context tag for RPC type classification.
 * Used by devtools to distinguish mutations from queries.
 */
export class RpcType extends Context.Tag("@hazel/rpc-devtools/RpcType")<RpcType, "mutation" | "query">() {}

// Re-export everything from Effect's Rpc
export * from "@effect/rpc/Rpc"

/**
 * Create a mutation RPC endpoint.
 * Mutations are operations that modify state (create, update, delete).
 */
export const mutation = <
	const Tag extends string,
	Payload extends Schema.Schema.Any | Schema.Struct.Fields = typeof Schema.Void,
	Success extends Schema.Schema.Any = typeof Schema.Void,
	Error extends Schema.Schema.All = typeof Schema.Never,
	const Stream extends boolean = false,
>(
	tag: Tag,
	options?: {
		readonly payload?: Payload
		readonly success?: Success
		readonly error?: Error
		readonly stream?: Stream
		readonly primaryKey?: [Payload] extends [Schema.Struct.Fields]
			? (payload: Schema.Simplify<Schema.Struct.Type<NoInfer<Payload>>>) => string
			: never
	},
): EffectRpc.Rpc<
	Tag,
	Payload extends Schema.Struct.Fields ? Schema.Struct<Payload> : Payload,
	Stream extends true ? RpcSchema.Stream<Success, Error> : Success,
	Stream extends true ? typeof Schema.Never : Error
> => EffectRpc.make(tag, options).annotate(RpcType, "mutation") as any

/**
 * Create a query RPC endpoint.
 * Queries are read-only operations that don't modify state (get, list, search).
 */
export const query = <
	const Tag extends string,
	Payload extends Schema.Schema.Any | Schema.Struct.Fields = typeof Schema.Void,
	Success extends Schema.Schema.Any = typeof Schema.Void,
	Error extends Schema.Schema.All = typeof Schema.Never,
	const Stream extends boolean = false,
>(
	tag: Tag,
	options?: {
		readonly payload?: Payload
		readonly success?: Success
		readonly error?: Error
		readonly stream?: Stream
		readonly primaryKey?: [Payload] extends [Schema.Struct.Fields]
			? (payload: Schema.Simplify<Schema.Struct.Type<NoInfer<Payload>>>) => string
			: never
	},
): EffectRpc.Rpc<
	Tag,
	Payload extends Schema.Struct.Fields ? Schema.Struct<Payload> : Payload,
	Stream extends true ? RpcSchema.Stream<Success, Error> : Success,
	Stream extends true ? typeof Schema.Never : Error
> => EffectRpc.make(tag, options).annotate(RpcType, "query") as any
