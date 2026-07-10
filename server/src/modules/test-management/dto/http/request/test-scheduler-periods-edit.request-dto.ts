import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsDefined, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class TestSchedulerPeriodAddDto {
	@IsDefined()
	@IsDateString()
	available_from: string;

	@IsOptional()
	@IsDateString()
	available_to?: string;
}

export class TestSchedulerPeriodEditDto extends TestSchedulerPeriodAddDto {
	@IsDefined()
	@IsNumber()
	id: number;
}

export class TestSchedulerPeriodsEditRequestDto {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestSchedulerPeriodAddDto)
	add: Array<TestSchedulerPeriodAddDto>;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestSchedulerPeriodEditDto)
	update: Array<TestSchedulerPeriodEditDto>;

	@IsOptional()
	@Type(() => Array<number>)
	remove: Array<number>;
}
