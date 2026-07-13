import { Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "@shared/ui/button";
import type { ScheduleComponentProps } from "@features/test/scheduler-test/model/scheduleForm";

export const AddSchedulerPeriod = ({ control }: ScheduleComponentProps<object>) => {
	const { t } = useTranslation();

	const { append, fields: schedulePeriods } = useFieldArray({ control, name: "schedulePeriods" });

	const handleClick = () => {
		const lastPeriod = schedulePeriods[schedulePeriods.length - 1];

		if (!lastPeriod.availableTo) {
			console.error("Last period doesn't have end date");
			return;
		}

		const now = new Date(lastPeriod.availableTo);

		now.setDate(now.getDate() + 1);

		append({
			id: now.getTime(),
			periodId: null,
			availableFrom: now,
			availableTo: null,
			isDeleted: false,
		});
	};

	return <ButtonWithIcon text={t("test_scheduler_form.button_add")} Icon={Plus} onClick={handleClick} />;
};
