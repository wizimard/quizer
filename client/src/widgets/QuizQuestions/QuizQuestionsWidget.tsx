import { useTranslation } from "react-i18next";
import { QuestionsList } from "./ui/QuestionsList";
import { QuestionSettings } from "./ui/QuestionSettings";
import { QuestionAddButton } from "./ui/QuestionAddButton";
import type { TQuiz } from "@entities/quiz";
import { Text } from "@shared/ui/text";

export interface IQuizQuestionsProps {
	quiz: TQuiz;
}

export const QuizQuestionsWidget = ({ quiz }: IQuizQuestionsProps) => {
	const { t } = useTranslation();

	return (
		<div className="w-full flex flex-col items-center">
			<div className="w-full">
				<Text component="h2" className="text-xl">
					{t("quiz.questions")}
				</Text>
			</div>
			<div className="w-full max-w-[600px]">
				<QuestionAddButton quiz={quiz} />
				<QuestionsList questions={quiz.questions} />
				<QuestionSettings />
			</div>
		</div>
	);
};
