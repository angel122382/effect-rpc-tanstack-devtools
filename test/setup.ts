import { beforeEach, vi } from "vitest"

declare global {
	var __EFFECT_RPC_DEVTOOLS_CLIENT__: unknown
	var __EFFECT_RPC_DEVTOOLS_DEBUG__: boolean | undefined
	var __EFFECT_RPC_DEVTOOLS_STORE_INITIALIZED__: boolean | undefined
	var __RPC_TYPE_RESOLVER__: unknown
}

let uuidCounter = 0

beforeEach(() => {
	// Reset globalThis keys between tests
	delete globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__
	delete globalThis.__EFFECT_RPC_DEVTOOLS_DEBUG__
	delete globalThis.__EFFECT_RPC_DEVTOOLS_STORE_INITIALIZED__
	delete globalThis.__RPC_TYPE_RESOLVER__

	// Reset UUID counter for deterministic IDs
	uuidCounter = 0

	// Mock crypto.randomUUID
	vi.stubGlobal("crypto", {
		randomUUID: () => `test-uuid-${++uuidCounter}`,
	})
})
