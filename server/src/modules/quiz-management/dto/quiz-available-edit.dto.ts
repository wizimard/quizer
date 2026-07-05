import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsDefined, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class QuizAvailableDto {
	@IsDefined()
	@IsNumber()
	id: number;

	@IsDefined()
	@IsDateString()
	available_from: string;

	@IsOptional()
	@IsDateString()
	available_to?: string;
}

export class QuizAvailableEditDto {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuizAvailableDto)
	add: Array<QuizAvailableDto>;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuizAvailableDto)
	update: Array<QuizAvailableDto>;

	@IsOptional()
	@Type(() => Array<number>)
	remove: Array<number>;
}
