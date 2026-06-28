import { Trim } from '@common/trim.decorator';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';
import { QuestionCreateDto } from './question-create.dto';

export class QuizCreateDto {
	@IsDefined()
	@IsString()
	@Trim()
	title: string;

	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuestionCreateDto)
	questions: Array<QuestionCreateDto>;
}
