import { beforeEach, describe, expect, it, vi } from "vitest"
import { rpcEventClient, setDebug } from "../src/event-client"

describe("rpcEventClient", () => {
	beforeEach(() => {
		// Reset is handled by test/setup.ts
	})

	describe("proxy behavior", () => {
		it("forwards method calls to the real client", () => {
			expect(typeof rpcEventClient.emit).toBe("function")
			expect(typeof rpcEventClient.on).toBe("function")
			expect(typeof rpcEventClient.getPluginId).toBe("function")
		})

		it("returns correct pluginId", () => {
			expect(rpcEventClient.getPluginId()).toBe("effect-rpc")
		})

		it("maintains reference after multiple accesses", () => {
			const emit1 = rpcEventClient.emit
			const emit2 = rpcEventClient.emit
			// Functions should be equivalent (bound to same client)
			expect(typeof emit1).toBe("function")
			expect(typeof emit2).toBe("function")
		})
	})

	describe("singleton pattern", () => {
		it("caches client in globalThis", () => {
			// Access the client
			rpcEventClient.getPluginId()

			// Check globalThis has the client
			expect(globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__).toBeDefined()
		})

		it("reuses cached client", () => {
			const pluginId1 = rpcEventClient.getPluginId()
			const pluginId2 = rpcEventClient.getPluginId()

			expect(pluginId1).toBe(pluginId2)
			expect(pluginId1).toBe("effect-rpc")
		})
	})
})

describe("setDebug", () => {
	beforeEach(() => {
		// Reset is handled by test/setup.ts
	})

	it("sets debug flag in globalThis", () => {
		expect(globalThis.__EFFECT_RPC_DEVTOOLS_DEBUG__).toBeUndefined()

		setDebug(true)

		expect(globalThis.__EFFECT_RPC_DEVTOOLS_DEBUG__).toBe(true)
	})

	it("recreates client when debug changes", () => {
		// Access client to create it
		rpcEventClient.getPluginId()
		const firstClient = globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__

		// Change debug setting
		setDebug(true)
		const secondClient = globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__

		expect(secondClient).not.toBe(firstClient)
	})

	it("does not recreate client when debug value is same", () => {
		setDebug(true)
		const firstClient = globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__

		setDebug(true)
		const secondClient = globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__

		expect(secondClient).toBe(firstClient)
	})

	it("proxy reflects new client after setDebug", () => {
		// Create initial client
		rpcEventClient.getPluginId()
		const initialClient = globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__

		// Change debug
		setDebug(true)

		// Proxy should now use new client
		rpcEventClient.getPluginId()
		const currentClient = globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__

		expect(currentClient).not.toBe(initialClient)
	})

	it("toggles debug off", () => {
		setDebug(true)
		expect(globalThis.__EFFECT_RPC_DEVTOOLS_DEBUG__).toBe(true)

		setDebug(false)
		expect(globalThis.__EFFECT_RPC_DEVTOOLS_DEBUG__).toBe(false)
	})
})

describe("isDev detection", () => {
	beforeEach(() => {
		vi.unstubAllEnvs()
	})

	it("creates client with enabled based on environment", () => {
		// In test environment, NODE_ENV is typically 'test', not 'development'
		// So the client should be created but may not be enabled
		rpcEventClient.getPluginId()
		expect(globalThis.__EFFECT_RPC_DEVTOOLS_CLIENT__).toBeDefined()
	})
})
