import { Trim } from '@shared/http/trim.decorator';
import { IsOptional, IsString } from 'class-validator';

export class TestUpdateDto {
	@IsOptional()
	@IsString()
	@Trim()
	title?: string;
}
