import { Trim } from '@shared/http/trim.decorator';
import { IsBoolean, IsDefined, IsString, MinLength } from 'class-validator';

export class TestSettingsUpdateRequestDto {
	@IsDefined()
	@IsString()
	@Trim()
	@MinLength(3)
	title: string;

	@IsDefined()
	@IsBoolean()
	show_answers_after_completion: boolean;
}
