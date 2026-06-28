import { useState } from "react";
import { DefaultButton } from "@shared/ui/button";
import { QuizDeleteDialog } from "../QuizDeleteDialog";
import { useTranslation } from "react-i18next";
import { useQuiz } from "@entities/quiz/model/store";
import { useQuizSettings } from "@pages/Quiz/store/settings.store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import type { TQuiz } from "@entities/quiz/model/quiz.interface";
import { QuizSettingsForm } from "@features/quiz";

export const QuizSettings = () => {
	const { t } = useTranslation();

	const quiz: TQuiz | null = useQuiz((state) => state.selectedQuiz);

	const isOpen: boolean = useQuizSettings((state) => state.isOpen);
	const setIsOpen: (isOpen: boolean) => void = useQuizSettings((state) => state.setIsOpen);

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

					<QuizSettingsForm />

					<DefaultButton variant="destructive" onClick={handleClickRemove}>
						{t("quiz_settings.button_delete_quiz")}
					</DefaultButton>
				</SheetContent>
			</Sheet>
			<QuizDeleteDialog quizId={quiz.id} handleClose={handleCloseDialog} isOpen={isOpenDeleteDialog} />
		</>
	);
};
