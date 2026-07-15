import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class TestRegisterRequestDto {
	@IsDefined()
	@IsString()
	@Trim()
	@IsNotEmpty()
	first_name: string;

	@IsDefined()
	@IsString()
	@Trim()
	@IsNotEmpty()
	last_name: string;
}
