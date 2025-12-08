import { EventClient } from "@tanstack/devtools-event-client"
import type { RpcDevtoolsEventMap } from "./types"

/**
 * Global key for the singleton event client
 * Using globalThis ensures the same instance is used across dynamic imports
 */
const GLOBAL_KEY = "__EFFECT_RPC_DEVTOOLS_CLIENT__" as const

declare global {
	var __EFFECT_RPC_DEVTOOLS_CLIENT__: EventClient<RpcDevtoolsEventMap, "effect-rpc"> | undefined
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
function getOrCreateClient(): EventClient<RpcDevtoolsEventMap, "effect-rpc"> {
	if (!globalThis[GLOBAL_KEY]) {
		const dev = isDev()
		globalThis[GLOBAL_KEY] = new EventClient<RpcDevtoolsEventMap, "effect-rpc">({
			pluginId: "effect-rpc",
			debug: dev,
			enabled: dev,
		})
	}
	return globalThis[GLOBAL_KEY]
}

/**
 * TanStack Devtools event client for Effect RPC
 *
 * This client emits events when RPC requests are made and responses are received.
 * The devtools panel subscribes to these events to display the RPC traffic.
 *
 * Uses globalThis to ensure singleton across dynamic imports.
 */
export const rpcEventClient = getOrCreateClient()
