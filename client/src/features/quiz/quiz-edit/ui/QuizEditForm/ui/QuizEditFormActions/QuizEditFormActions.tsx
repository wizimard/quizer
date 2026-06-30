import { DefaultButton } from "@shared/ui/button";
import { useTranslation } from "react-i18next";

export interface IQuizEditFormActionsProps {
	isSubmitting: boolean;
	isDirty: boolean;
	onCancel: () => void;
}

export const QuizEditFormActions = ({ isSubmitting, isDirty, onCancel }: IQuizEditFormActionsProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex w-full justify-end px-5 py-2.5">
			<div className="inline-flex gap-2" role="group" aria-label="Form actions">
				<DefaultButton type="submit" variant="outlined" isLoading={isSubmitting} disabled={!isDirty}>
					{t("common.button_save")}
				</DefaultButton>
				<DefaultButton type="button" variant="outlined" onClick={onCancel}>
					{t("common.button_cancel")}
				</DefaultButton>
			</div>
		</div>
	);
};
