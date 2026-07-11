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
import { createNodeResolver, importX } from "eslint-plugin-import-x";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fsdImportResolver = require("./fsd-import-resolver.cjs");

const importResolverSettings = {
	"import-x/resolver-next": [fsdImportResolver, createNodeResolver()],
	"import/resolver": {
		typescript: {
			project: "./tsconfig.app.json",
			alwaysTryTypes: true,
		},
		node: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
		},
	},
};

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx,js}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			importX.flatConfigs.recommended,
			importX.flatConfigs.typescript,
		],
		languageOptions: {
			globals: globals.browser,
			parser: tsParser,
		},
		plugins: {
			"@typescript-eslint": typescriptEslint,
			prettier: prettier,
			"import-x": importX,
		},
		settings: importResolverSettings,
		rules: {
			...prettierConfig.rules,
			"prettier/prettier": "error",
			"import-x/order": "warn",
			"import-x/no-unresolved": "warn",
			"import-x/no-duplicates": "warn",
			"import-x/no-extraneous-dependencies": "warn",
			"import-x/no-anonymous-default-export": "warn",
		},
	},
	{
		files: ["src/**/*.{ts,tsx,js}"],
		plugins: { boundaries },
		settings: {
			...importResolverSettings,
			"boundaries/root-path": "./src",
			"boundaries/dependency-nodes": ["import"],
			"boundaries/elements": [
				{ type: "app", pattern: "app" },
				{ type: "pages", pattern: "pages" },
				{ type: "widgets", pattern: "widgets/*", capture: ["slice"] },
				{ type: "features", pattern: "features/*", capture: ["slice"] },
				{ type: "entities", pattern: "entities/*", capture: ["slice"] },
				{ type: "shared", pattern: "shared" },
			],
		},
		rules: {
			...boundaries.configs.recommended.rules,
			"boundaries/element-types": "off",
			"boundaries/entry-point": "off",
			"boundaries/external": "off",
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
							from: [{ type: "widgets", captured: { slice: "{{ from.captured.slice }}" } }],
							allow: [{ to: { type: "widgets", captured: { slice: "{{ from.captured.slice }}" } } }],
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
