import { Trim } from '@shared/http/trim.decorator';
import { IsOptional, IsString } from 'class-validator';

export class QuizUpdateDto {
	@IsOptional()
	@IsString()
	@Trim()
	title?: string;
}
