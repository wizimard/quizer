import { useTranslation } from "react-i18next";
import { useFieldArray } from "react-hook-form";
import { SchedulerPeriod } from "./ui/SchedulerPeriod";
import { AddSchedulerPeriod } from "./ui/AddSchedulerPeriod";
import { Text } from "@shared/ui/text";
import { Separator } from "@shared/ui/kit/separator";
import type { ScheduleComponentProps } from "@features/test/scheduler-test/model/scheduleForm";

export const TestSchedulerPeriods = ({ control }: ScheduleComponentProps<object>) => {
	const { t } = useTranslation();

	const { fields: schedulePeriods, append, remove } = useFieldArray({ control, name: "schedulePeriods" });

	return (
		<div className="flex flex-col gap-2">
			<Text variant="h6">{t("test_scheduler_form.title")}</Text>
			<div className="flex flex-col gap-2">
				{schedulePeriods.map((period, index) => (
					<slot key={period.id}>
						<SchedulerPeriod id={period.periodId} control={control} name={`schedulePeriods.${index}`} index={index} remove={remove} />
						{index < schedulePeriods.length - 1 && <Separator className="mt-3 mb-1" />}
					</slot>
				))}
			</div>
			<AddSchedulerPeriod append={append} />
		</div>
	);
};
