import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import { QuizAvailablePeriod } from "./ui/QuizAvailablePeriod/QuizAvailablePeriod";
import { QuizAddAvailablePeriod } from "./ui/QuizAddAvailablePeriod";
import type { TSettingsQuizComponentProps } from "@features/quiz/quiz-settings/model/settingsQuizForm";
import { useFieldArray } from "react-hook-form";
import { Separator } from "@shared/ui/kit/separator";

export const QuizAvailablePeriods = ({ control }: TSettingsQuizComponentProps<object>) => {
	const { t } = useTranslation();

	const { fields: availablePeriods, append, remove } = useFieldArray({ control, name: "availablePeriods" });

	return (
		<div className="flex flex-col gap-2">
			<Text variant="h6">{t("quiz_settings.available_periods.title")}</Text>
			<div className="flex flex-col gap-2">
				{availablePeriods.map((period, index) => (
					<slot key={period.id}>
						<QuizAvailablePeriod id={period.periodId} control={control} name={`availablePeriods.${index}`} index={index} remove={remove} />
						{index < availablePeriods.length - 1 && <Separator className="mt-3 mb-1" />}
					</slot>
				))}
			</div>
			<QuizAddAvailablePeriod append={append} />
		</div>
	);
};
