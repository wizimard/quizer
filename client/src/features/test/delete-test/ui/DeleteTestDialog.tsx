import { useTranslation } from "react-i18next";
import { useTestDelete } from "../api/test-delete";
import { DefaultButton } from "@shared/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@shared/ui/kit/dialog";
import { Typography } from "@shared/ui/typography";
import { DIALOG_KEYS, useManageOpenDialog } from "@shared/model";

interface DeleteTestDialogProps {
	testId: string;
}

export const DeleteTestDialog = ({ testId }: DeleteTestDialogProps) => {
	const { t } = useTranslation();

	const { isLoading, errorMessage, handleDelete } = useTestDelete();
	const { isOpen, closeDialog } = useManageOpenDialog(DIALOG_KEYS.DELETE_TEST);

	const handleRemove = async () => {
		handleDelete(testId);
	};

	return (
		<Dialog open={isOpen} onOpenChange={closeDialog}>
			<DialogContent showCloseButton={false} className="pb-10 flex flex-col items-center gap-2.5">
				<Typography className="w-full text-left text-[150%]">{t("test_delete.dialog.title")}</Typography>
				<Typography className="w-full text-left">{t("test_delete.dialog.description")}</Typography>
				<img src="/test_card_img.png" alt="test image" className="w-[150px] shrink-0" />

				{errorMessage && <Typography color="error">{t(errorMessage)}</Typography>}

				<DialogFooter className="mt-5 w-full border-0 bg-transparent p-0">
					<DefaultButton variant="outline" onClick={closeDialog}>
						{t("common.button_cancel")}
					</DefaultButton>
					<DefaultButton variant="destructive" onClick={handleRemove} isLoading={isLoading}>
						{t("common.button_delete")}
					</DefaultButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
