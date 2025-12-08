import { RpcClient } from "@effect/rpc"
import type { FromClientEncoded, FromServerEncoded } from "@effect/rpc/RpcMessage"
import { Effect, Layer } from "effect"
import { rpcEventClient } from "./event-client"
import { getRpcType } from "./rpc-type-resolver"

/**
 * Map to track request timestamps for duration calculation
 */
const requestTimestamps = new Map<string, number>()

/**
 * Protocol wrapper layer - captures BOTH requests and responses
 *
 * This intercepts at the transport layer:
 * - send() for outgoing RPC requests
 * - run() for incoming server responses
 *
 * No need to modify RPC definitions - this captures all traffic.
 *
 * @example
 * ```typescript
 * import { DevtoolsProtocolLayer } from "@hazel/rpc-devtools"
 *
 * // Add to your RPC client layer composition
 * const ProtocolLive = import.meta.env.DEV
 *   ? Layer.provideMerge(DevtoolsProtocolLayer, BaseProtocolLive)
 *   : BaseProtocolLive
 * ```
 */
export const DevtoolsProtocolLayer = Layer.effect(
	RpcClient.Protocol,
	Effect.gen(function* () {
		const base = yield* RpcClient.Protocol

		return {
			supportsAck: base.supportsAck,
			supportsTransferables: base.supportsTransferables,

			// Intercept outgoing requests
			send: (request: FromClientEncoded, transferables?: ReadonlyArray<Transferable>) => {
				if (request._tag === "Request") {
					const timestamp = Date.now()
					const id = request.id
					requestTimestamps.set(id, timestamp)

					rpcEventClient.emit("request", {
						id,
						method: request.tag,
						type: getRpcType(request.tag),
						payload: request.payload,
						timestamp,
						headers: request.headers ?? [],
					})
				}
				return base.send(request, transferables)
			},

			// Intercept incoming responses
			run: (handler: (data: FromServerEncoded) => Effect.Effect<void>) =>
				base.run((message: FromServerEncoded) => {
					if (message._tag === "Exit") {
						const id = message.requestId
						const startTime = requestTimestamps.get(id)
						const timestamp = Date.now()
						const duration = startTime ? timestamp - startTime : 0
						requestTimestamps.delete(id)

						rpcEventClient.emit("response", {
							requestId: id,
							status: message.exit._tag === "Success" ? "success" : "error",
							data: message.exit._tag === "Success" ? message.exit.value : message.exit.cause,
							duration,
							timestamp,
						})
					}
					return handler(message)
				}),
		}
	}),
)

/**
 * Clear request tracking state
 */
export const clearRequestTracking = () => {
	requestTimestamps.clear()
}
