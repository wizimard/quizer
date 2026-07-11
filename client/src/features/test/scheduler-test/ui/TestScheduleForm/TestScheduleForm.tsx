import { useTranslation } from "react-i18next";
import { useTestScheduleForm } from "../../hooks/useTestScheduleForm";
import { TestSchedulerPeriods } from "./ui/TestAvailablePeriods";
import { DefaultButton } from "@shared/ui/button";
import { type TestFull } from "@entities/test";
import { Text } from "@shared/ui/text";

export interface TestScheduleFormProps {
	test: TestFull;
}

export const TestScheduleForm = ({ test }: TestScheduleFormProps) => {
	const { t } = useTranslation();

	const { control, submitHandler, resetForm, isSubmitting, isDirty, formError } = useTestScheduleForm(test);

	return (
		<form onSubmit={submitHandler} className="flex flex-col gap-2.5">
			<TestSchedulerPeriods control={control} />

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
