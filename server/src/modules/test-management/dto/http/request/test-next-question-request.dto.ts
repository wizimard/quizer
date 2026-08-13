import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class TestNextQuestionRequestDto {
	@IsDefined()
	@IsString()
	@Trim()
	@IsNotEmpty()
	question_id: string;
}
