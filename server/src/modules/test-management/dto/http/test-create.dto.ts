import { Trim } from '@shared/http/trim.decorator';
import { IsDefined, IsString } from 'class-validator';

export class TestCreateDto {
	@IsDefined()
	@IsString()
	@Trim()
	title: string;
}
