import { useTranslation } from "react-i18next";
import { DialogContent, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { BaseDialog } from "@shared/ui/dialog";
import { CreateTestForm } from "@features/test/create-test";

export interface CreateTestDialogProps {
	isOpen: boolean;
	handleClose(): void;
}

export const CreateTestDialog = ({ isOpen, handleClose }: CreateTestDialogProps) => {
	const { t } = useTranslation();

	return (
		<BaseDialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="pb-5">
				<DialogHeader>
					<DialogTitle>{t("test_list.add_button")}</DialogTitle>
				</DialogHeader>
				<CreateTestForm />
			</DialogContent>
		</BaseDialog>
	);
};
