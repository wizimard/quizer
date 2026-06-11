import { Trim } from '@common/trim.decorator';
import { IsIn, IsNumber, IsObject, IsString } from 'class-validator';
import { QUESTION_TYPES_CLASSES_MAP } from '../entities/question-configs/question-config.map';

export class QuestionCreateDto {
	@IsString()
	@Trim()
	id: string;

	@IsString()
	@Trim()
	description: string;

	@IsNumber()
	order: number;

	@IsObject()
	config: object;
}
