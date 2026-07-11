import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWatch, type Path, type UseFieldArrayRemove } from "react-hook-form";
import { FormDateTimeField } from "@shared/ui/form";
import { Text } from "@shared/ui/text";
import { Button } from "@shared/ui/kit/button";
import type { ScheduleForm, ScheduleComponentProps } from "@features/test/scheduler-test/model/scheduleForm";
import { useScheduleFormStore } from "@features/test/scheduler-test/store/scheduleFormStore";

export interface SchedulerPeriodProps {
	name: Extract<Path<ScheduleForm>, `schedulePeriods.${number}`>;
	index: number;
	remove: UseFieldArrayRemove;
	id: number | null;
}

export const SchedulerPeriod = ({ control, name, index, remove, id }: ScheduleComponentProps<SchedulerPeriodProps>) => {
	const { t } = useTranslation();

	const addDeletedSchedulePeriod = useScheduleFormStore((state) => state.addDeletedSchedulePeriod);

	const handleRemove = () => {
		remove(index);

		if (id) {
			addDeletedSchedulePeriod(id);
		}
	};

	const availableFrom: Date = useWatch({ control, name: `${name}.availableFrom` });

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<Text variant="body1">{t("test_scheduler_form.period.title")}</Text>
				<Button type="button" variant="ghost" size="icon-sm" aria-label="delete" onClick={handleRemove}>
					<Trash2 className="text-destructive" />
				</Button>
			</div>
			<FormDateTimeField control={control} name={`${name}.availableFrom`} label="test_scheduler_form.period.available_from.label" />
			<FormDateTimeField control={control} name={`${name}.availableTo`} label="test_scheduler_form.period.available_to.label" allowEmpty minDate={availableFrom} />
		</div>
	);
};
