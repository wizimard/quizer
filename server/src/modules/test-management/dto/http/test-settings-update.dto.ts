import { Trim } from '@shared/http/trim.decorator';
import { IsBoolean, IsDefined, IsString, MinLength } from 'class-validator';

export class TestSettingsUpdateDto {
	@IsDefined()
	@IsString()
	@Trim()
	@MinLength(3)
	title: string;

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
}
