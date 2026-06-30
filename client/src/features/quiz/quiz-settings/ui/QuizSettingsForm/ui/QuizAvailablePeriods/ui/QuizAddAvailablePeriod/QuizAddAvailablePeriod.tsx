import type { ISettingsQuizForm } from "@features/quiz/quiz-settings/model/settingsQuizForm";
import { ButtonWithIcon } from "@shared/ui/button";
import { Plus } from "lucide-react";
import { type UseFieldArrayAppend } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface IQuizAddAvailablePeriodProps {
	append: UseFieldArrayAppend<ISettingsQuizForm, "availablePeriods">;
}

export const QuizAddAvailablePeriod = ({ append }: IQuizAddAvailablePeriodProps) => {
	const { t } = useTranslation();

	const handleClick = () => {
		append({
			id: null,
			periodId: null,
			available_from: new Date(),
			available_to: null,
		});
	};

	return <ButtonWithIcon text={t("quiz_settings.available_periods.button_add")} Icon={Plus} onClick={handleClick} />;
};
