import { IsNumber, IsOptional } from 'class-validator';

export class TestStartDto {
	@IsOptional()
	@IsNumber()
	duration?: number;
}
