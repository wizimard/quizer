import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWatch, type Path } from "react-hook-form";
import { memo } from "react";
import { FormDateTimeField } from "@shared/ui/form";
import { Typography } from "@shared/ui/typography";
import { Button } from "@shared/ui/kit/button";
import type { ScheduleForm, ScheduleComponentProps } from "@features/test/scheduler-test/model/scheduleForm";

export interface SchedulerPeriodProps {
	name: Extract<Path<ScheduleForm>, `schedulePeriods.${number}`>;
	index: number;
	remove: (index: number) => void;
	id: number | null;
}

export const SchedulerPeriod = memo(({ control, name, index, remove }: ScheduleComponentProps<SchedulerPeriodProps>) => {
	const { t } = useTranslation();

	const handleRemove = () => {
		remove(index);
	};

	const availableFrom: Date = useWatch({ control, name: `${name}.availableFrom` });

	const now = new Date();
	now.setTime(now.getTime() + 5 * 60 * 1000);

	const minDate = new Date();

	if (availableFrom > minDate) {
		minDate.setTime(availableFrom.getTime() + 5 * 60 * 1000);
	}

	return (
		<fieldset className="min-w-0 max-w-full flex flex-col gap-2" disabled={now > availableFrom}>
			<div className="flex items-center justify-between gap-2">
				<Typography variant="body1">{t("test_scheduler_form.period.title")}</Typography>
				<Button type="button" variant="ghost" size="icon-sm" aria-label="delete" onClick={handleRemove}>
					<Trash2 className="text-destructive" />
				</Button>
			</div>
			<FormDateTimeField control={control} name={`${name}.availableFrom`} label="test_scheduler_form.period.available_from.label" />
			<FormDateTimeField control={control} name={`${name}.availableTo`} label="test_scheduler_form.period.available_to.label" allowEmpty minDate={minDate} />
		</fieldset>
	);
});
