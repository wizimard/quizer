import type { Config } from 'jest';
import { join } from 'node:path';

const prismaClientPath = join(process.cwd(), 'generated/prisma/client.ts').replace(/\\/g, '/');

const tsJestOptions = {
	useESM: true,
	diagnostics: {
		ignoreCodes: [1343],
	},
	astTransformers: {
		before: [
			{
				path: 'ts-jest-mock-import-meta',
				options: {
					metaObjectReplacement: {
						url: `file://${prismaClientPath}`,
					},
				},
			},
		],
	},
	tsconfig: {
		target: 'ESNext',
		module: 'ESNext',
		moduleResolution: 'bundler',
		esModuleInterop: true,
		allowSyntheticDefaultImports: true,
		ignoreDeprecations: '6.0',
	},
};

const config: Config = {
	verbose: true,
	maxWorkers: 1,
	preset: 'ts-jest/presets/default-esm',
	rootDir: './',
	testRegex: 'test/e2e/.*\\.e2e-spec\\.ts$',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^@shared/(.*)$': '<rootDir>/src/shared/$1',
		'^@modules/(.*)$': '<rootDir>/src/modules/$1',
		'^@app/(.*)$': '<rootDir>/src/app/$1',
		'^@prisma/client/runtime/(.*)$': '<rootDir>/node_modules/@prisma/client/runtime/$1',
		'^@prisma/client$': '<rootDir>/generated/prisma/client',
		'^@prisma/models$': '<rootDir>/generated/prisma/models',
	},
	transformIgnorePatterns: ['node_modules/(?!(@inversifyjs|inversify|chalk|@prisma)/)'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', tsJestOptions],
		'^.+\\.m?jsx?$': [
			'ts-jest',
			{
				...tsJestOptions,
				tsconfig: {
					...tsJestOptions.tsconfig,
					allowJs: true,
				},
			},
		],
	},
};

export default config;
