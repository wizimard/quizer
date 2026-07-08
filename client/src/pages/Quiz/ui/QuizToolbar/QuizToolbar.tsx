import { SettingsDrawerButton } from "../SettingsDrawerButton";
import { QuizSettings } from "../QuizSettings/QuizSettings";
import { isQuizStatusOpen } from "@entities/quiz";
import { Text } from "@shared/ui/text";
import type { TQuiz } from "@entities/quiz";
import { QuizStatus } from "@entities/quiz/ui/QuizStatus";
import { QuizStop } from "@features/quiz/quiz-stop";
import { QuizStart } from "@features/quiz/quiz-start";

export interface IQuizToolbar {
	quiz: TQuiz;
}

export const QuizToolbar = ({ quiz }: IQuizToolbar) => {
	return (
		<>
			<div className="flex w-full items-center gap-3">
				<Text component="h1" className="text-[1.4rem]">
					{quiz.title}
				</Text>
				<QuizStatus status={quiz.status} className="ml-auto" />
				{isQuizStatusOpen(quiz.status) ? <QuizStop quiz={quiz} /> : <QuizStart quiz={quiz} />}
				<SettingsDrawerButton />
			</div>
			<QuizSettings quiz={quiz} />
		</>
	);
};
