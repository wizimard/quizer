import { Plus } from "lucide-react";
import { type UseFieldArrayAppend } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "@shared/ui/button";
import type { ScheduleForm } from "@features/test/scheduler-test/model/scheduleForm";

export interface AddSchedulerPeriodProps {
	append: UseFieldArrayAppend<ScheduleForm, "schedulePeriods">;
}

export const AddSchedulerPeriod = ({ append }: AddSchedulerPeriodProps) => {
	const { t } = useTranslation();

	const handleClick = () => {
		append({
			id: null,
			periodId: null,
			availableFrom: new Date(),
			availableTo: null,
		});
	};

	return <ButtonWithIcon text={t("test_scheduler_form.button_add")} Icon={Plus} onClick={handleClick} />;
};
