import { useTranslation } from "react-i18next";
import { useGeneralSettingsTestForm } from "../../hooks/useGeneralSettingsQuizForm";
import { TestSettingsAfterCompletion } from "./ui/TestSettingsAfterCompletion";
import { TestSettingsLoginData } from "./ui/TestSettingsLoginData";
import { Separator } from "@shared/ui/kit/separator";
import { DefaultButton } from "@shared/ui/button";
import { FormTextField } from "@shared/ui/form";
import { Text } from "@shared/ui/text";
import type { TestFull } from "@entities/test";

export interface TestGeneralSettingsFormProps {
	test: TestFull;
}

export const TestGeneralSettingsForm = ({ test }: TestGeneralSettingsFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, resetForm, isSubmitting, isDirty, formError } = useGeneralSettingsTestForm(test);

	return (
		<form onSubmit={submitHandler} className="flex flex-col gap-2.5">
			<FormTextField control={control} name="title" placeholder="test_general_settings_form.title.placeholder" label="test_general_settings_form.title.label" className="mb-5" />
			<TestSettingsLoginData control={control} />
			<Separator className="mt-2" />

			<TestSettingsAfterCompletion control={control} />

			{formError?.message && <Text color="error">{t(formError.message)}</Text>}

			<div className="mt-2.5 flex gap-2.5">
				<DefaultButton type="submit" isLoading={isSubmitting} disabled={!isDirty} onClick={submitHandler}>
					{t("common.button_save")}
				</DefaultButton>
				<DefaultButton variant="ghost" className="text-zinc-900" disabled={!isDirty} onClick={resetForm}>
					{t("common.button_cancel")}
				</DefaultButton>
			</div>
		</form>
	);
};
