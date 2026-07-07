import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsObject, IsString, Validate } from 'class-validator';
import { IsQuestionConfigConstraint } from '../../utils/validators/is-question-config.validator';

export class QuestionCreateDto {
	@IsDefined()
	@IsString()
	@Trim()
	description: string;

	@IsDefined()
	@IsObject()
	@Validate(IsQuestionConfigConstraint)
	config: object;
}
