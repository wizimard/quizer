import type { Config } from 'jest';

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
						url: ({ fileName }: { fileName: string }) => `file://${fileName}`,
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
	preset: 'ts-jest/presets/default-esm',
	rootDir: './',
	testRegex: 'test/e2e/.*\\.e2e-spec\\.ts$',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^@domain/(.*)$': '<rootDir>/src/domain/$1',
		'^@application/(.*)$': '<rootDir>/src/application/$1',
		'^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
		'^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
		'^@composition/(.*)$': '<rootDir>/src/composition/$1',
		'^@common/(.*)$': '<rootDir>/src/interfaces/http/common/$1',
		'^@database$': '<rootDir>/src/infrastructure/persistence/database',
		'^@logger$': '<rootDir>/src/logger',
		'^@app_types$': '<rootDir>/src/app.types',
		'^@config$': '<rootDir>/src/config',
		'^@error$': '<rootDir>/src/error',
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
