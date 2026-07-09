import { Trim } from '@shared/http/trim.decorator';
import { IsArray, IsDefined, IsObject, IsString, Validate, ValidateNested } from 'class-validator';
import { IsQuestionConfigConstraint } from '../../utils/validators/is-question-config.validator';
import { Type } from 'class-transformer';

export class QuestionUpdateDto {
	@IsDefined()
	@IsString()
	@Trim()
	description: string;

	@IsDefined()
	@IsObject()
	@Validate(IsQuestionConfigConstraint)
	config: object;
}

export class QuestionUpdateRequestDto {
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuestionUpdateDto)
	questions: QuestionUpdateDto[];
}
