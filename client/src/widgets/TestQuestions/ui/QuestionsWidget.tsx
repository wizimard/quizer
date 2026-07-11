import { useTranslation } from "react-i18next";
import { QuestionsList } from "./QuestionsList";
import { QuestionSettings } from "./QuestionSettings";
import { QuestionAddButton } from "./QuestionAddButton";
import { Text } from "@shared/ui/text";
import type { TestFull } from "@entities/test";

export interface QuestionsWidgetProps {
	test: TestFull;
}

export const QuestionsWidget = ({ test }: QuestionsWidgetProps) => {
	const { t } = useTranslation();

	return (
		<div className="w-full flex flex-col items-center">
			<div className="w-full">
				<Text component="h2" className="text-xl">
					{t("test.questions")}
				</Text>
			</div>
			<div className="w-full max-w-[600px]">
				<QuestionAddButton test={test} />
				<QuestionsList questions={test.questions} />
				<QuestionSettings />
			</div>
		</div>
	);
};
