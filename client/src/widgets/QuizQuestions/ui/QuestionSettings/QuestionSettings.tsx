import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { useQuestionDrawer } from "@widgets/QuizQuestions/store/question-drawer";
import { QuestionForm } from "@features/question/question-insert";
import { DefaultButton } from "@shared/ui/button";
import { QuestionDeleteDialog, useQuestionDelete } from "@features/question/question-delete";

export const QuestionSettings = () => {
	const { t } = useTranslation();

	const isOpenDrawer = useQuestionDrawer((state) => state.isOpen);
	const setIsOpenDrawer = useQuestionDrawer((state) => state.setIsOpen);

	const question = useQuestionDrawer((state) => state.question);
	const setIsOpen = useQuestionDelete((state) => state.setIsOpen);
	const setQuestion = useQuestionDelete((state) => state.setQuestion);

	if (!question) {
		return null;
	}

	const handleClickDelete = () => {
		setIsOpen(true);
		setQuestion(question);
	};

	const handleDeleteSuccess = () => {
		setIsOpenDrawer(false);
	};

	return (
		<>
			<Sheet open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
				<SheetContent side="right" className="scrollbar-styled w-[400px] gap-1 overflow-y-auto p-0 sm:max-w-[350px]">
					<SheetHeader className="px-5">
						<SheetTitle className="text-xl font-semibold tracking-tight">{t("question_settings.title")}</SheetTitle>
					</SheetHeader>
					<div className="px-5 pb-2 flex flex-col gap-4">
						<QuestionForm question={question} />
						<DefaultButton variant="destructive" onClick={handleClickDelete}>
							{t("question_delete.button")}
						</DefaultButton>
					</div>
				</SheetContent>
			</Sheet>
			<QuestionDeleteDialog onDeleteSuccess={handleDeleteSuccess} />
		</>
	);
};
