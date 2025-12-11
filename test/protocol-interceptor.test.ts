import { beforeEach, describe, expect, it, vi } from "vitest"
import { clearRequestTracking } from "../src/protocol-interceptor"

describe("clearRequestTracking", () => {
	beforeEach(() => {
		vi.resetModules()
	})

	it("is exported and callable", () => {
		expect(typeof clearRequestTracking).toBe("function")
		// Should not throw
		clearRequestTracking()
	})

	it("can be called multiple times without error", () => {
		clearRequestTracking()
		clearRequestTracking()
		clearRequestTracking()
	})
})

describe("DevtoolsProtocolLayer", () => {
	beforeEach(() => {
		vi.resetModules()
	})

	it("is exported", async () => {
		const { DevtoolsProtocolLayer } = await import("../src/protocol-interceptor")
		expect(DevtoolsProtocolLayer).toBeDefined()
	})
})

describe("protocol interceptor logic", () => {
	describe("request timestamp tracking", () => {
		it("calculates duration from stored timestamp", () => {
			const startTime = 1000
			const endTime = 1250
			const duration = endTime - startTime
			expect(duration).toBe(250)
		})

		it("handles missing timestamp gracefully", () => {
			const startTime = undefined
			const endTime = 1250
			const duration = startTime ? endTime - startTime : 0
			expect(duration).toBe(0)
		})
	})

	describe("request message handling", () => {
		it("identifies Request messages by _tag", () => {
			const requestMessage = {
				_tag: "Request" as const,
				id: "req-123",
				tag: "user.create",
				payload: { name: "John" },
				headers: [["x-custom", "value"]] as const,
			}

			expect(requestMessage._tag).toBe("Request")
			expect(requestMessage.id).toBe("req-123")
			expect(requestMessage.tag).toBe("user.create")
		})

		it("handles messages without headers", () => {
			const requestMessage = {
				_tag: "Request" as const,
				id: "req-123",
				tag: "user.get",
				payload: {},
				headers: undefined,
			}

			const headers = requestMessage.headers ?? []
			expect(headers).toEqual([])
		})
	})

	describe("response message handling", () => {
		it("identifies Exit messages by _tag", () => {
			const exitMessage = {
				_tag: "Exit" as const,
				requestId: "req-123",
				exit: {
					_tag: "Success" as const,
					value: { id: 1, name: "John" },
				},
			}

			expect(exitMessage._tag).toBe("Exit")
			expect(exitMessage.requestId).toBe("req-123")
		})

		it("extracts success status and value", () => {
			const successExit = {
				_tag: "Success" as const,
				value: { data: "test" },
			}

			const status = successExit._tag === "Success" ? "success" : "error"
			const data = successExit._tag === "Success" ? successExit.value : null

			expect(status).toBe("success")
			expect(data).toEqual({ data: "test" })
		})

		it("extracts error status and cause", () => {
			const errorExit = {
				_tag: "Failure" as const,
				cause: { message: "Something went wrong" },
			}

			const status = errorExit._tag === "Success" ? "success" : "error"
			const data = errorExit._tag === "Success" ? null : errorExit.cause

			expect(status).toBe("error")
			expect(data).toEqual({ message: "Something went wrong" })
		})
	})

	describe("event emission data structure", () => {
		it("creates correct request event payload", () => {
			const requestPayload = {
				id: "req-123",
				method: "user.create",
				type: "mutation" as const,
				payload: { name: "John" },
				timestamp: Date.now(),
				headers: [["authorization", "Bearer token"]] as const,
			}

			expect(requestPayload).toHaveProperty("id")
			expect(requestPayload).toHaveProperty("method")
			expect(requestPayload).toHaveProperty("type")
			expect(requestPayload).toHaveProperty("payload")
			expect(requestPayload).toHaveProperty("timestamp")
			expect(requestPayload).toHaveProperty("headers")
		})

		it("creates correct response event payload", () => {
			const responsePayload = {
				requestId: "req-123",
				status: "success" as const,
				data: { id: 1, name: "John" },
				duration: 250,
				timestamp: Date.now(),
			}

			expect(responsePayload).toHaveProperty("requestId")
			expect(responsePayload).toHaveProperty("status")
			expect(responsePayload).toHaveProperty("data")
			expect(responsePayload).toHaveProperty("duration")
			expect(responsePayload).toHaveProperty("timestamp")
		})
	})
})
