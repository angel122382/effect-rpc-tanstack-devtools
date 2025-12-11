import { EventClient } from "@tanstack/devtools-event-client"
import type { RpcDevtoolsEventMap } from "./types"

type RpcEventClient = EventClient<RpcDevtoolsEventMap, "effect-rpc">

const CLIENT_KEY = "__EFFECT_RPC_DEVTOOLS_CLIENT__" as const
const DEBUG_KEY = "__EFFECT_RPC_DEVTOOLS_DEBUG__" as const

declare global {
	var __EFFECT_RPC_DEVTOOLS_CLIENT__: RpcEventClient | undefined
	var __EFFECT_RPC_DEVTOOLS_DEBUG__: boolean | undefined
}

/**
 * Check if we're in a development environment
 */
const isDev = () => {
	try {
		// Vite
		if (typeof import.meta !== "undefined" && "env" in import.meta) {
			return (import.meta as any).env?.DEV ?? false
		}
	} catch {
		// Ignore
	}
	try {
		// Node.js
		return process.env.NODE_ENV === "development"
	} catch {
		return false
	}
}

/**
 * Get or create the singleton event client
 */
function getClient(): RpcEventClient {
	if (!globalThis[CLIENT_KEY]) {
		globalThis[CLIENT_KEY] = new EventClient<RpcDevtoolsEventMap, "effect-rpc">({
			pluginId: "effect-rpc",
			debug: globalThis[DEBUG_KEY] ?? false,
			enabled: isDev(),
		})
	}
	return globalThis[CLIENT_KEY]
}

/**
 * TanStack Devtools event client for Effect RPC
 *
 * This client emits events when RPC requests are made and responses are received.
 * The devtools panel subscribes to these events to display the RPC traffic.
 *
 * Implemented as a Proxy to ensure setDebug() changes are reflected even after import.
 */
export const rpcEventClient: RpcEventClient = new Proxy({} as RpcEventClient, {
	get(_, prop) {
		const client = getClient()
		const value = client[prop as keyof RpcEventClient]
		return typeof value === "function" ? value.bind(client) : value
	},
})

/**
 * Enable or disable debug logging for the RPC devtools event client.
 * Debug is disabled by default. This recreates the client with the new setting.
 */
export function setDebug(debug: boolean): void {
	if ((globalThis[DEBUG_KEY] ?? false) !== debug) {
		globalThis[DEBUG_KEY] = debug
		globalThis[CLIENT_KEY] = new EventClient<RpcDevtoolsEventMap, "effect-rpc">({
			pluginId: "effect-rpc",
			debug,
			enabled: isDev(),
		})
	}
}
