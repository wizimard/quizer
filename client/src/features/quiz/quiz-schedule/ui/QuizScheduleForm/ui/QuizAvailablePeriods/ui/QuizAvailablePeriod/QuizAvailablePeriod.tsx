import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWatch, type Path, type UseFieldArrayRemove } from "react-hook-form";
import { FormDateTimeField } from "@shared/ui/form";
import { Text } from "@shared/ui/text";
import { Button } from "@shared/ui/kit/button";
import { useScheduleFormStore } from "@features/quiz/quiz-schedule/store/scheduleFormStore";
import type { IScheduleForm, TScheduleComponentProps } from "@features/quiz/quiz-schedule/model/scheduleForm";

export interface IQuizAvailablePeriodProps {
	name: Extract<Path<IScheduleForm>, `availablePeriods.${number}`>;
	index: number;
	remove: UseFieldArrayRemove;
	id: number | null;
}

export const QuizAvailablePeriod = ({ control, name, index, remove, id }: TScheduleComponentProps<IQuizAvailablePeriodProps>) => {
	const { t } = useTranslation();

	const addDeletedAvailablePeriod = useScheduleFormStore((state) => state.addDeletedAvailablePeriod);

	const handleRemove = () => {
		remove(index);

		if (id) {
			addDeletedAvailablePeriod(id);
		}
	};

	const availableFrom: Date = useWatch({ control, name: `${name}.available_from` });

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<Text variant="body1">{t("quiz_scheduler_form.period.title")}</Text>
				<Button type="button" variant="ghost" size="icon-sm" aria-label="delete" onClick={handleRemove}>
					<Trash2 className="text-destructive" />
				</Button>
			</div>
			<FormDateTimeField control={control} name={`${name}.available_from`} label="quiz_scheduler_form.period.available_from.label" />
			<FormDateTimeField control={control} name={`${name}.available_to`} label="quiz_scheduler_form.period.available_to.label" allowEmpty minDate={availableFrom} />
		</div>
	);
};
