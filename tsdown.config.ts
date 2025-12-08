import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		index: "src/index.ts",
		builders: "src/builders.ts",
		"components/index": "src/components/index.ts",
	},
	format: ["esm"],
	dts: true,
	clean: true,
})
