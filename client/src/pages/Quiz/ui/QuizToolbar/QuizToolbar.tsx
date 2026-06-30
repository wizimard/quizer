import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { Link } from "react-router";
import { SettingsDrawerButton } from "../SettingsDrawerButton";
import { QuizSettings } from "../QuizSettings/QuizSettings";
import type { TQuiz } from "@entities/quiz";

export interface IQuizToolbar {
	quiz: TQuiz;
}

export const QuizToolbar = ({ quiz }: IQuizToolbar) => {
	const { t } = useTranslation();

	return (
		<>
			<div className="flex w-full justify-between">
				<Text component="h1" className="text-[1.4rem]">
					{t("quiz.title")} {quiz.title}
				</Text>
				<div className="flex gap-2.5">
					<Link to={`/quiz-edit/${quiz.id}`} className="flex h-full items-center justify-center text-muted-foreground hover:text-foreground" title="Нажмите, чтобы внести изменения в тест">
						<Pencil className="size-5" />
					</Link>
					<SettingsDrawerButton />
					<QuizSettings quiz={quiz} />
				</div>
			</div>
		</>
	);
};
