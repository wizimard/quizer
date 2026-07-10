import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsString } from 'class-validator';

export class TestCreateRequestDto {
	@IsDefined()
	@IsString()
	@Trim()
	title: string;
}
