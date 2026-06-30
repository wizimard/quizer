import { Transform, type TransformOptions } from 'class-transformer';

export function Trim(transformOptions?: TransformOptions): PropertyDecorator {
	return Transform(({ value }) => {
		return typeof value !== 'string' ? value : value.trim();
	}, transformOptions);
}
