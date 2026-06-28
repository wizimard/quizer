import type { TQuizAvailablePeriod } from "@entities/quiz/model/quiz.interface";
import type { QuizSettingsUpdateRequestBody } from "@shared/api/generated";
import type { Control } from "react-hook-form";
import * as zod from "zod";

export interface ISettingsQuizFormAvailablePeriod extends Omit<TQuizAvailablePeriod, "quizId"> {
	periodId: number | null;
}

export interface ISettingsQuizForm extends Pick<QuizSettingsUpdateRequestBody, "isRequiredEmail" | "isRequiredFirstName" | "isRequiredLastName" | "isShowAnswersAfterCompletion"> {
	availablePeriods: Array<ISettingsQuizFormAvailablePeriod>;
}

const availablePeriodSchema = zod
	.object({
		id: zod.number().nullable(),
		periodId: zod.number().nullable(),
		available_from: zod.date(),
		available_to: zod.date().nullish(),
	})
	.refine((data) => !data.available_to || data.available_to > data.available_from, {
		message: "quiz_settings.available_periods.period.validation_errors.available_to_after_from",
		path: ["available_to"],
	});

function doAvailablePeriodsOverlap(first: { available_from: Date; available_to?: Date | null }, second: { available_from: Date; available_to?: Date | null }): boolean {
	const firstStart = first.available_from.getTime();
	const firstEnd = first.available_to?.getTime() ?? Number.POSITIVE_INFINITY;
	const secondStart = second.available_from.getTime();
	const secondEnd = second.available_to?.getTime() ?? Number.POSITIVE_INFINITY;

	return firstStart < secondEnd && secondStart < firstEnd;
}

export const settingsQuizFormValidationSchema = zod.object({
	availablePeriods: zod.array(availablePeriodSchema).superRefine((periods, ctx) => {
		const overlapMessage = "quiz_settings.available_periods.period.validation_errors.overlap";

		for (let i = 0; i < periods.length; i++) {
			for (let j = i + 1; j < periods.length; j++) {
				if (!doAvailablePeriodsOverlap(periods[i], periods[j])) {
					continue;
				}

				ctx.addIssue({ code: "custom", message: overlapMessage, path: [i, "available_from"] });
				ctx.addIssue({ code: "custom", message: overlapMessage, path: [j, "available_from"] });
			}
		}
	}),
	isRequiredEmail: zod.boolean(),
	isRequiredFirstName: zod.boolean(),
	isRequiredLastName: zod.boolean(),
	isShowAnswersAfterCompletion: zod.boolean(),
});

export type TSettingsQuizForm = zod.infer<typeof settingsQuizFormValidationSchema>;

export type TSettingsQuizComponentProps<T> = T & {
	control: Control<ISettingsQuizForm, unknown, ISettingsQuizForm>;
};
