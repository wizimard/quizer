import { IsNumber, IsOptional } from 'class-validator';

export class TestStartRequestDto {
	@IsOptional()
	@IsNumber()
	duration?: number;
}
