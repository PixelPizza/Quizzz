import type { Options } from "tsup";

export const tsup: Options = {
	clean: true,
	dts: false,
	entry: ["src/**/*.ts"],
	keepNames: true,
	format: ["cjs"],
	minify: true,
	skipNodeModulesBundle: true,
	sourcemap: false,
	target: "es2020"
};
