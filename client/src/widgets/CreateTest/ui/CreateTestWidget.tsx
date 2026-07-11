import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CreateTestDialog } from "./CreateTestDialog";
import { ButtonAdd } from "@shared/ui/button/ButtonAdd";

export const CreateTestWidget = () => {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);

	const handleClickNewTest = () => {
		setIsOpen(true);
	};

	const handleCloseDialog = () => {
		setIsOpen(false);
	};

	return (
		<>
			<ButtonAdd text={t("test_list.add_button")} onClick={handleClickNewTest} />
			<CreateTestDialog isOpen={isOpen} handleClose={handleCloseDialog} />
		</>
	);
};
