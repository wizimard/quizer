import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "@shared/ui/button";
import { type TQuiz } from "@entities/quiz";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/kit/tabs";
import { QuizDeleteDialog } from "@features/quiz/quiz-delete";
import { QuizGeneralSettingsForm } from "@features/quiz/quiz-settings-general";
import { QuizScheduleForm } from "@features/quiz/quiz-schedule";
import { useQuizSettingsDrawer } from "@pages/Quiz/store/settings-drawer.store";

export interface IQuizSettingsProps {
	quiz: TQuiz;
}
// TODO: translate
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
				<SheetContent side="right" className="scrollbar-styled w-[350px] gap-1 overflow-y-auto p-0 sm:max-w-[350px]">
					<SheetHeader className="px-5">
						<SheetTitle className="text-xl font-semibold tracking-tight">Настройки</SheetTitle>
					</SheetHeader>

					<Tabs defaultValue="general" className="gap-4 p-1">
						<TabsList className="grid h-auto w-full grid-cols-4">
							<TabsTrigger value="general" className="text-xs">
								Общие
							</TabsTrigger>
							<TabsTrigger value="scheduler" className="text-xs">
								Планировщик
							</TabsTrigger>
							<TabsTrigger value="link" className="text-xs">
								Ссылка
							</TabsTrigger>
							<TabsTrigger value="delete" className="text-xs">
								Удалить
							</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="px-5">
							<QuizGeneralSettingsForm quiz={quiz} />
						</TabsContent>

						<TabsContent value="scheduler" className="px-5">
							<QuizScheduleForm quiz={quiz} />
						</TabsContent>

						<TabsContent value="link" className="px-5" />

						<TabsContent value="delete" className="px-5">
							<DefaultButton variant="destructive" onClick={handleClickRemove}>
								{t("quiz_delete.button")}
							</DefaultButton>
						</TabsContent>
					</Tabs>
				</SheetContent>
			</Sheet>
			<QuizDeleteDialog quizId={quiz.id} isOpen={isOpenDeleteDialog} handleClose={handleCloseDialog} />
		</>
	);
};
