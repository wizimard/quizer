import { useTranslation } from "react-i18next";
import type { FieldValues } from "react-hook-form";
import { FormCheckboxField, type TFormCheckboxField } from "./FormCheckboxField";
import { Field, FieldLabel } from "@shared/ui/kit/field";
import { cn } from "@shared/lib/utils";

export type TFormCheckboxLabelFieldProps<T extends FieldValues> = TFormCheckboxField<T> & {
	label: string;
};

export const FormCheckboxLabelField = <T extends object>({ control, name, label, className, ...props }: TFormCheckboxLabelFieldProps<T>) => {
	const { t } = useTranslation();

	return (
		<Field orientation="horizontal" className={cn(className)}>
			<FormCheckboxField control={control} name={name} {...props} className="mt-0.5" />
			<FieldLabel>{t(label)}</FieldLabel>
		</Field>
	);
};
