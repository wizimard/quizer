import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsDefined, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class TestSchedulerPeriodDto {
	@IsDefined()
	@IsNumber()
	id: number;

	@IsDefined()
	@IsDateString()
	available_from: string;

	@IsOptional()
	@IsDateString()
	available_to?: string;
}

export class TestSchedulerPeriodsEditDto {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestSchedulerPeriodDto)
	add: Array<TestSchedulerPeriodDto>;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestSchedulerPeriodDto)
	update: Array<TestSchedulerPeriodDto>;

	@IsOptional()
	@Type(() => Array<number>)
	remove: Array<number>;
}
