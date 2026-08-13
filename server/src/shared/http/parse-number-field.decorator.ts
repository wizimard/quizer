import { Transform, type TransformOptions } from 'class-transformer';

export function ParseNumberField(transformOptions?: TransformOptions): PropertyDecorator {
	return Transform(({ value }) => {
		if (value === undefined || value === null || value === '') {
			return undefined;
		}

		return Number(value);
	}, transformOptions);
}
