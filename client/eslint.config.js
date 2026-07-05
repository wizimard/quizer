import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import-x";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx,js}"],
		extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
		languageOptions: {
			globals: globals.browser,
			parser: tsParser,
		},

		plugins: {
			"@typescript-eslint": typescriptEslint,
			prettier: prettier,
			import: importPlugin,
		},
		settings: {
			"import-x/resolver": {
				typescript: {
					project: "./tsconfig.app.json",
				},
				node: true,
			},
		},
		rules: {
			...prettierConfig.rules,
			"prettier/prettier": "error",
			"import/order": "warn",
			"import/no-unresolved": "warn",
			"import/no-duplicates": "warn",
			"import/no-extraneous-dependencies": "warn",
			"import/no-anonymous-default-export": "warn",
		},
	},
	{
		files: ["src/**/*.{ts,tsx,js}"],
		plugins: { boundaries },
		settings: {
			"boundaries/root-path": "./src",
			"boundaries/dependency-nodes": ["import"],
			"boundaries/elements": [
				{ type: "app", pattern: "app" },
				{ type: "pages", pattern: "pages" },
				{ type: "widgets", pattern: "widgets" },
				{ type: "features", pattern: "features/*", capture: ["slice"] },
				{ type: "entities", pattern: "entities/*", capture: ["slice"] },
				{ type: "shared", pattern: "shared" },
			],
		},
		rules: {
			...boundaries.configs.recommended.rules,
			"boundaries/dependencies": [
				"error",
				{
					default: "disallow",
					rules: [
						{
							from: { type: "app" },
							allow: [{ to: { type: ["pages", "widgets", "features", "entities", "shared"] } }],
						},
						{
							from: { type: "pages" },
							allow: [{ to: { type: ["widgets", "features", "entities", "shared"] } }],
						},
						{
							from: { type: "widgets" },
							allow: [{ to: { type: ["features", "entities", "shared"] } }],
						},
						{
							from: { type: "features" },
							allow: [{ to: { type: ["entities", "shared"] } }],
						},
						{
							from: [{ type: "features", captured: { slice: "{{ from.captured.slice }}" } }],
							allow: [{ to: { type: "features", captured: { slice: "{{ from.captured.slice }}" } } }],
						},
						{
							from: { type: "entities" },
							allow: [{ to: { type: "shared" } }],
						},
						{
							from: { type: "shared" },
							allow: [{ to: { type: "shared" } }],
						},
					],
				},
			],
		},
	},
]);
