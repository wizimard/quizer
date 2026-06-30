import { Trim } from '@common/trim.decorator';
import { IsNumber, IsObject, IsString, Validate } from 'class-validator';
import { IsQuestionConfigConstraint } from './validators/is-question-config.validator';

export class QuestionCreateDto {
	@IsString()
	@Trim()
	id: string;

	@IsString()
	@Trim()
	description: string;

	@IsNumber()
	order: number;

	@IsObject()
	@Validate(IsQuestionConfigConstraint)
	config: object;
}
