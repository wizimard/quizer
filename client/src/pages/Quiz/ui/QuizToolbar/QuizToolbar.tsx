import { SettingsDrawerButton } from "../SettingsDrawerButton";
import { QuizSettings } from "../QuizSettings/QuizSettings";
import { Text } from "@shared/ui/text";
import type { TQuiz } from "@entities/quiz";

export interface IQuizToolbar {
	quiz: TQuiz;
}

export const QuizToolbar = ({ quiz }: IQuizToolbar) => {
	return (
		<>
			<div className="flex w-full justify-between">
				<Text component="h1" className="text-[1.4rem]">
					{quiz.title}
				</Text>
				<div className="flex gap-2.5">
					<SettingsDrawerButton />
				</div>
			</div>
			<QuizSettings quiz={quiz} />
		</>
	);
};
