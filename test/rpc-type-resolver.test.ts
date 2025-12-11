import { beforeEach, describe, expect, it } from "vitest"
import { getRpcType, heuristicResolver, setRpcTypeResolver } from "../src/rpc-type-resolver"

describe("heuristicResolver", () => {
	describe("mutation patterns", () => {
		it.each([
			["user.create", "mutation"],
			["user.update", "mutation"],
			["user.delete", "mutation"],
			["item.add", "mutation"],
			["item.remove", "mutation"],
			["config.set", "mutation"],
			["notification.mark", "mutation"],
			["token.regenerate", "mutation"],
			["User.Create", "mutation"],
			["USER.UPDATE", "mutation"],
		])("recognizes %s as %s", (method, expected) => {
			expect(heuristicResolver(method)).toBe(expected)
		})
	})

	describe("query patterns", () => {
		it.each([
			["user.list", "query"],
			["user.get", "query"],
			["auth.me", "query"],
			["item.search", "query"],
			["item.find", "query"],
			["User.List", "query"],
			["USER.GET", "query"],
		])("recognizes %s as %s", (method, expected) => {
			expect(heuristicResolver(method)).toBe(expected)
		})
	})

	describe("unknown patterns", () => {
		it.each([
			["user.validate"],
			["item.process"],
			["config.load"],
			["unknown"],
			[""],
		])("returns undefined for %s", (method) => {
			expect(heuristicResolver(method)).toBeUndefined()
		})
	})

	describe("pattern matching", () => {
		it("requires dot prefix for patterns", () => {
			expect(heuristicResolver("create")).toBeUndefined()
			expect(heuristicResolver("getUser")).toBeUndefined()
			expect(heuristicResolver("listItems")).toBeUndefined()
		})

		it("matches patterns anywhere after a dot", () => {
			expect(heuristicResolver("api.users.create")).toBe("mutation")
			expect(heuristicResolver("v2.items.list")).toBe("query")
		})
	})
})

describe("setRpcTypeResolver / getRpcType", () => {
	beforeEach(() => {
		// Reset to heuristic resolver before each test
		setRpcTypeResolver(heuristicResolver)
	})

	it("uses heuristic resolver by default", () => {
		expect(getRpcType("user.create")).toBe("mutation")
		expect(getRpcType("user.list")).toBe("query")
	})

	it("allows setting a custom resolver", () => {
		const customResolver = (method: string) => {
			if (method.startsWith("admin.")) return "mutation" as const
			if (method.startsWith("public.")) return "query" as const
			return undefined
		}

		setRpcTypeResolver(customResolver)

		expect(getRpcType("admin.anything")).toBe("mutation")
		expect(getRpcType("public.anything")).toBe("query")
		expect(getRpcType("other.method")).toBeUndefined()
	})

	it("can chain resolvers with fallback", () => {
		const customWithFallback = (method: string) => {
			if (method === "special.method") return "mutation" as const
			return heuristicResolver(method)
		}

		setRpcTypeResolver(customWithFallback)

		expect(getRpcType("special.method")).toBe("mutation")
		expect(getRpcType("user.create")).toBe("mutation")
		expect(getRpcType("user.list")).toBe("query")
	})

	it("resolver returning undefined allows fallthrough", () => {
		setRpcTypeResolver(() => undefined)
		expect(getRpcType("user.create")).toBeUndefined()
	})
})
