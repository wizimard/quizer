import { Trim } from '@shared/http/trim.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuestionChangeOrderDto {
	@IsOptional()
	@IsString()
	@Trim()
	@IsNotEmpty()
	previousQuestionId: string | null;

	@IsOptional()
	@IsString()
	@Trim()
	@IsNotEmpty()
	nextQuestionId: string | null;
}
