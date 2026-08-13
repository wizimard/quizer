import { ParseJsonField } from '@shared/http/parse-json-field.decorator';
import { ParseNumberField } from '@shared/http/parse-number-field.decorator';
import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsNumber, IsObject, IsOptional, IsString, Validate } from 'class-validator';
import { IsQuestionConfigConstraint } from '../../../utils/validators/is-question-config.validator';

export class QuestionUpdateRequestDto {
	@IsDefined()
	@IsString()
	@Trim()
	description: string;

	@IsDefined()
	@IsObject()
	@ParseJsonField()
	@Validate(IsQuestionConfigConstraint)
	config: object;

	@IsOptional()
	@IsNumber()
	@ParseNumberField()
	score?: number;
}
