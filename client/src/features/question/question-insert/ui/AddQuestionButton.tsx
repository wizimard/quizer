import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/kit/button";

export const AddQuestionButton = () => {
	const { t } = useTranslation();
	return (
		<Button>
			<PlusIcon />
			{t("quiz.add_question_button")}
		</Button>
	);
};
