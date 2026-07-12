import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { CreateTestForm } from "@features/test/create-test";
import { DIALOG_KEYS, useDialog } from "@shared/model";

export const CreateTestDialog = () => {
	const { t } = useTranslation();

	const { isOpen, closeDialog } = useDialog(DIALOG_KEYS.CREATE_TEST);

	return (
		<Dialog open={isOpen} onOpenChange={closeDialog}>
			<DialogContent className="pb-5">
				<DialogHeader>
					<DialogTitle>{t("test_list.add_button")}</DialogTitle>
				</DialogHeader>
				<CreateTestForm />
			</DialogContent>
		</Dialog>
	);
};
