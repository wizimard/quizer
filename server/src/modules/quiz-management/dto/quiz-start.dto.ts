import { IsNumber, IsOptional } from 'class-validator';

export class QuizStartDto {
	@IsOptional()
	@IsNumber()
	duration?: number;
}
