import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import * as React from "react";
import { SchedulerPeriod } from "./ui/SchedulerPeriod";
import { AddSchedulerPeriod } from "./ui/AddSchedulerPeriod";
import { Typography } from "@shared/ui/typography";
import { Separator } from "@shared/ui/kit/separator";
import type { ScheduleComponentProps } from "@features/test/scheduler-test/model/scheduleForm";

export interface TestSchedulerPeriodsProps {
	remove: (index: number) => void;
}

export const TestSchedulerPeriods = ({ control, remove }: ScheduleComponentProps<TestSchedulerPeriodsProps>) => {
	const { t } = useTranslation();

	const schedulePeriods = useWatch({ control, name: "schedulePeriods" });

	const visibleSchedulePeriodsCount = schedulePeriods.reduce((acc, period) => (period.isDeleted ? acc : acc + 1), 0);

	return (
		<div className="flex flex-col gap-2">
			<Typography variant="h6">{t("test_scheduler_form.title")}</Typography>
			<div className="flex flex-col gap-2">
				{schedulePeriods.map((period, index) => (
					<React.Fragment key={period.id}>
						{period.isDeleted ? (
							<></>
						) : (
							<>
								<SchedulerPeriod id={period.periodId} control={control} name={`schedulePeriods.${index}`} index={index} remove={remove} />
								{index < visibleSchedulePeriodsCount - 1 && <Separator className="mt-3 mb-1" />}
							</>
						)}
					</React.Fragment>
				))}
			</div>
			<AddSchedulerPeriod control={control} />
		</div>
	);
};
