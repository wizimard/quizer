import { useState } from "react";
import { DefaultButton } from "@shared/ui/button";
import { useTranslation } from "react-i18next";
import { type TQuiz } from "@entities/quiz";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { QuizDeleteDialog } from "@features/quiz/quiz-delete";
import { QuizSettingsForm } from "@features/quiz/quiz-settings";
import { useQuizSettingsDrawer } from "@pages/Quiz";

export interface IQuizSettingsProps {
	quiz: TQuiz;
}

export const QuizSettings = ({ quiz }: IQuizSettingsProps) => {
	const { t } = useTranslation();

	const isOpen: boolean = useQuizSettingsDrawer((state) => state.isOpen);
	const setIsOpen: (isOpen: boolean) => void = useQuizSettingsDrawer((state) => state.setIsOpen);

	const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);

	const handleClickRemove = () => {
		setIsOpenDeleteDialog(true);
	};

	const handleCloseDialog = () => {
		setIsOpenDeleteDialog(false);
	};

	if (!quiz) {
		return null;
	}

	return (
		<>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="right" className="scrollbar-styled w-[350px] gap-5 overflow-y-auto p-5 sm:max-w-[350px]">
					<SheetHeader className="p-0">
						<SheetTitle className="text-xl font-semibold tracking-tight">Настройки</SheetTitle>
					</SheetHeader>

					<QuizSettingsForm quiz={quiz} />

					<DefaultButton variant="destructive" onClick={handleClickRemove}>
						{t("quiz_settings.button_delete_quiz")}
					</DefaultButton>
				</SheetContent>
			</Sheet>
			<QuizDeleteDialog quizId={quiz.id} isOpen={isOpenDeleteDialog} handleClose={handleCloseDialog} />
		</>
	);
};
