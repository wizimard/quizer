import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { QuestionForm } from "@features/question/question-insert";
import { DefaultButton } from "@shared/ui/button";
import { QuestionDeleteDialog } from "@features/question/question-delete";
import type { Question } from "@entities/question";
import { useIsOpenDrawer, DRAWER_KEYS, useSetOpenDrawer, useGetDataDrawer, DIALOG_KEYS, useOpenDialog } from "@shared/model";

// TODO: review
export const QuestionSettingsDrawer = () => {
	const { t } = useTranslation();

	const isOpenDrawer = useIsOpenDrawer(DRAWER_KEYS.QUESTION_SETTINGS);
	const setOpenDrawer = useSetOpenDrawer(DRAWER_KEYS.QUESTION_SETTINGS);

	const question = useGetDataDrawer<Question>(DRAWER_KEYS.QUESTION_SETTINGS);

	const openDialog = useOpenDialog(DIALOG_KEYS.QUESTION_DELETE);

	const handleClickDelete = () => {
		openDialog();
	};

	const handleChangeOpen = (open: boolean) => {
		console.log(open);
		setOpenDrawer(open);
	};

	if (!question) {
		return null;
	}

	return (
		<>
			<Sheet open={isOpenDrawer} onOpenChange={handleChangeOpen}>
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
			<QuestionDeleteDialog question={question} />
		</>
	);
};
