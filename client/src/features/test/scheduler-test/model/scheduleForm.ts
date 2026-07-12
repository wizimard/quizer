import type { Control } from "react-hook-form";
import * as zod from "zod";

const schedulePeriodSchema = zod
	.object({
		id: zod.number().nullable(),
		periodId: zod.number().nullable(),
		availableFrom: zod.date(),
		availableTo: zod.date().nullish(),
		isDeleted: zod.boolean().default(false),
	})
	.refine((data) => !data.availableTo || data.availableTo > data.availableFrom, {
		message: "test_scheduler_form.period.validation_errors.availableTo_after_from",
		path: ["availableTo"],
	});

function doSchedulePeriodsOverlap(first: { availableFrom: Date; availableTo?: Date | null }, second: { availableFrom: Date; availableTo?: Date | null }): boolean {
	const firstStart = first.availableFrom.getTime();
	const firstEnd = first.availableTo?.getTime() ?? Number.POSITIVE_INFINITY;
	const secondStart = second.availableFrom.getTime();
	const secondEnd = second.availableTo?.getTime() ?? Number.POSITIVE_INFINITY;

	return firstStart < secondEnd && secondStart < firstEnd;
}

export const scheduleFormValidationSchema = zod.object({
	schedulePeriods: zod.array(schedulePeriodSchema).superRefine((periods, ctx) => {
		const overlapMessage = "test_scheduler_form.period.validation_errors.overlap";

		for (let i = 0; i < periods.length; i++) {
			for (let j = i + 1; j < periods.length; j++) {
				if (!doSchedulePeriodsOverlap(periods[i], periods[j])) {
					continue;
				}

				ctx.addIssue({ code: "custom", message: overlapMessage, path: [i, "availableFrom"] });
				ctx.addIssue({ code: "custom", message: overlapMessage, path: [j, "availableFrom"] });
			}
		}
	}),
});

export type ScheduleForm = zod.infer<typeof scheduleFormValidationSchema>;

export type ScheduleComponentProps<T> = T & {
	control: Control<ScheduleForm, unknown, ScheduleForm>;
};
