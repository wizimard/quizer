import { Trim } from '@common/trim.decorator';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from 'class-validator';
import { QuizAvailableEditDto } from './quiz-available-edit.dto';

export class QuizSettingsUpdateDto {
	@IsString()
	@Trim()
	id: string;

	@IsDefined()
	@IsBoolean()
	isRequiredEmail: boolean;

	@IsDefined()
	@IsBoolean()
	isRequiredFirstName: boolean;

	@IsDefined()
	@IsBoolean()
	isRequiredLastName: boolean;

	@IsDefined()
	@IsBoolean()
	isShowAnswersAfterCompletion: boolean;

	@IsOptional()
	@ValidateNested()
	@Type(() => QuizAvailableEditDto)
	available_periods?: QuizAvailableEditDto;
}
