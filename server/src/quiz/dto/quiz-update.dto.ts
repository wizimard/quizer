import { Trim } from '@common/trim.decorator';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { QuestionCreateDto } from './question-create.dto';

export class QuizUpdateDto {
	@IsString()
	@Trim()
	id: string;

	@IsOptional()
	@IsString()
	@Trim()
	title?: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuestionCreateDto)
	add?: QuestionCreateDto[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuestionCreateDto)
	update?: QuestionCreateDto[];

	@IsOptional()
	@Type(() => Array<string>)
	delete?: string[];
}
