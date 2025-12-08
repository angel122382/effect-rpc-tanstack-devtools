/**
 * Types for Effect RPC Devtools
 */

/**
 * Event map for TanStack devtools event bus
 * Keys must follow the pattern: `${pluginId}:${eventSuffix}`
 */
export interface RpcDevtoolsEventMap {
	"effect-rpc:request": RpcRequestEvent
	"effect-rpc:response": RpcResponseEvent
	"effect-rpc:clear": undefined
}

/**
 * Event payload for RPC request
 */
export interface RpcRequestEvent {
	id: string
	method: string
	type?: "mutation" | "query"
	payload: unknown
	timestamp: number
	headers: ReadonlyArray<[string, string]>
}

/**
 * Event payload for RPC response
 */
export interface RpcResponseEvent {
	requestId: string
	status: "success" | "error"
	data: unknown
	duration: number
	timestamp: number
}

/**
 * A captured RPC request with optional response
 */
export interface CapturedRequest {
	/** Unique client-side ID for React keys (RPC protocol IDs can be reused) */
	captureId: string
	/** Original RPC protocol ID (for response matching) */
	id: string
	method: string
	/** Whether this RPC is a mutation or query */
	type?: "mutation" | "query"
	payload: unknown
	headers: ReadonlyArray<[string, string]>
	timestamp: number
	startTime: number
	response?: {
		status: "success" | "error"
		data: unknown
		duration: number
		timestamp: number
	}
}
