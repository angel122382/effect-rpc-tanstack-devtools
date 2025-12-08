import type { RpcGroup } from "@effect/rpc"
import { Context, Option } from "effect"
import { RpcType } from "./builders"

/**
 * Function type for resolving RPC method names to mutation/query classification
 */
export type RpcTypeResolver = (method: string) => "mutation" | "query" | undefined

/**
 * Build a resolver from RpcGroup definitions
 *
 * @example
 * ```typescript
 * import { createRpcTypeResolver, setRpcTypeResolver } from "@hazel/rpc-devtools"
 * import { MyRpcs, OtherRpcs } from "./my-rpcs"
 *
 * setRpcTypeResolver(createRpcTypeResolver([MyRpcs, OtherRpcs]))
 * ```
 */
export const createRpcTypeResolver = (rpcGroups: RpcGroup.RpcGroup<any>[]): RpcTypeResolver => {
	const typeMap = new Map<string, "mutation" | "query">()

	for (const group of rpcGroups) {
		for (const [tag, rpc] of group.requests) {
			const typeOption = Context.getOption(rpc.annotations, RpcType)
			if (Option.isSome(typeOption)) {
				typeMap.set(tag, typeOption.value)
			}
		}
	}

	return (method) => typeMap.get(method)
}

/**
 * Fallback heuristic-based resolver that infers type from method name patterns
 *
 * Patterns detected:
 * - Mutations: create, update, delete, add, remove, set, mark, regenerate
 * - Queries: list, get, me, search, find
 */
export const heuristicResolver: RpcTypeResolver = (method) => {
	const lower = method.toLowerCase()
	if (/\.(create|update|delete|add|remove|set|mark|regenerate)/.test(lower)) {
		return "mutation"
	}
	if (/\.(list|get|me|search|find)/.test(lower)) {
		return "query"
	}
	return undefined
}

/**
 * Global resolver that can be configured
 * Defaults to heuristic resolver
 */
let _resolver: RpcTypeResolver = heuristicResolver

/**
 * Set the global RPC type resolver
 *
 * @example
 * ```typescript
 * // Use annotation-based resolution from your RPC definitions
 * setRpcTypeResolver(createRpcTypeResolver([MyRpcs]))
 *
 * // Or provide a custom resolver
 * setRpcTypeResolver((method) => {
 *   if (method.includes('update')) return 'mutation'
 *   return 'query'
 * })
 * ```
 */
export const setRpcTypeResolver = (resolver: RpcTypeResolver) => {
	_resolver = resolver
}

/**
 * Get the RPC type for a given method name
 */
export const getRpcType = (method: string) => _resolver(method)
