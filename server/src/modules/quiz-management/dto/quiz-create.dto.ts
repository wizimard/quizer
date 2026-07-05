import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsString } from 'class-validator';

export class QuizCreateDto {
	@IsDefined()
	@IsString()
	@Trim()
	title: string;
}
