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
	testRegex: 'test/unit/.*\\.spec\\.ts$',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^@shared/(.*)$': '<rootDir>/src/shared/$1',
		'^@modules/(.*)$': '<rootDir>/src/modules/$1',
		'^@app/(.*)$': '<rootDir>/src/app/$1',
	},
	transformIgnorePatterns: ['node_modules/(?!(@inversifyjs|inversify|chalk)/)'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', tsJestOptions],
	},
};

export default config;
