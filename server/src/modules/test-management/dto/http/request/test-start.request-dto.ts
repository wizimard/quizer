import { TestSessionRunMode } from '@prisma/client';
import { IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class TestStartRequestDto {
	@IsDefined()
	@IsEnum(TestSessionRunMode)
	run_mode: TestSessionRunMode;

	@IsOptional()
	@IsNumber()
	duration?: number;
}
