import { useTranslation } from "react-i18next";
import { QuestionsList } from "./QuestionsList";
import { QuestionSettingsDrawer } from "./QuestionSettingsDrawer";
import { QuestionAddButton } from "./QuestionAddButton";
import { Typography } from "@shared/ui/typography";
import type { TestFull } from "@entities/test";

export interface QuestionsWidgetProps {
	test: TestFull;
}

export const QuestionsWidget = ({ test }: QuestionsWidgetProps) => {
	const { t } = useTranslation();

	return (
		<div className="w-full flex flex-col items-center">
			<div className="w-full">
				<Typography component="h2" className="text-xl">
					{t("test.questions")}
				</Typography>
			</div>
			<div className="w-full max-w-[600px]">
				<QuestionAddButton test={test} />
				<QuestionsList questions={test.questions} />
				<QuestionSettingsDrawer />
			</div>
		</div>
	);
};
