import { Trim } from '@shared/http/trim.decorator';
import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuestionAnswerRequestDto {
	@IsDefined()
	@IsString()
	@Trim()
	@IsNotEmpty()
	user_id: string;

	@IsDefined()
	@IsString()
	@Trim()
	@IsNotEmpty()
	answer?: string;

	@IsOptional()
	@IsBoolean()
	skipped?: boolean;
}
