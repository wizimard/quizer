import { Trim } from '@shared/http/trim.decorator';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QuizAvailableDto {
	@IsDefined()
	@IsNumber()
	id: number;

	@IsDefined()
	@IsDate()
	available_from: Date;

	@IsOptional()
	@IsDate()
	available_to?: Date;
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
