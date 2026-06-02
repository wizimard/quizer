import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest/presets/default-esm',
	rootDir: './',
	testRegex: 'test/e2e/.*\\.e2e-spec\\.ts$',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^@common/(.*)$': '<rootDir>/src/common/$1',
		'^@database$': '<rootDir>/src/database',
		'^@logger$': '<rootDir>/src/logger',
		'^@app_types$': '<rootDir>/src/app.types',
		'^@config$': '<rootDir>/src/config',
		'^@user$': '<rootDir>/src/user',
		'^@auth$': '<rootDir>/src/auth',
		'^@error$': '<rootDir>/src/error',
		'^@prisma/client$': '<rootDir>/node_modules/@prisma/client',
		'^@prisma$': '<rootDir>/generated/prisma',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					target: 'ESNext',
					module: 'ESNext',
					moduleResolution: 'bundler',
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					ignoreDeprecations: '6.0',
				},
			},
		],
	},
};

export default config;
