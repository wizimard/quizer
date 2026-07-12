import { useTranslation } from "react-i18next";
import { CreateTestDialog } from "./CreateTestDialog";
import { ButtonAdd } from "@shared/ui/button/ButtonAdd";
import { DIALOG_KEYS, useOpenDialog } from "@shared/model";

export const CreateTestWidget = () => {
	const { t } = useTranslation();

	const openDialog = useOpenDialog(DIALOG_KEYS.CREATE_TEST);

	const handleClickNewTest = () => {
		openDialog();
	};

	return (
		<>
			<ButtonAdd text={t("test_list.add_button")} onClick={handleClickNewTest} />
			<CreateTestDialog />
		</>
	);
};
