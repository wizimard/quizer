import { useTranslation } from "react-i18next";
import { DefaultButton } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import { DIALOG_KEYS, useOpenDialog } from "@shared/model";

export const TestDeleteTab = () => {
	const { t } = useTranslation();

	const openDialog = useOpenDialog(DIALOG_KEYS.DELETE_TEST);

	return (
		<>
			<Typography>{t("test_delete.description")}</Typography>
			<DefaultButton variant="destructive" onClick={openDialog} className="mt-5 w-full">
				{t("test_delete.button")}
			</DefaultButton>
		</>
	);
};
