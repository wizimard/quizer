import { Trim } from '@shared/http/trim.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuestionChangeOrderRequestDto {
	@IsOptional()
	@IsString()
	@Trim()
	@IsNotEmpty()
	previous_question_id: string | null;

	@IsOptional()
	@IsString()
	@Trim()
	@IsNotEmpty()
	next_question_id: string | null;
}
