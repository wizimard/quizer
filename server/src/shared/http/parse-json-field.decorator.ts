import { Transform, type TransformOptions } from 'class-transformer';

export function ParseJsonField(transformOptions?: TransformOptions): PropertyDecorator {
	return Transform(({ value }) => {
		if (typeof value === 'string') {
			return JSON.parse(value) as unknown;
		}

		return value;
	}, transformOptions);
}
