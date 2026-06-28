import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@shared/ui/kit/field";
import { cn } from "@shared/lib/utils";
import FormCheckboxField, { type TFormCheckboxField } from "../FormCheckboxField/FormCheckboxField";

export type TFormCheckboxLabelFieldProps<T> = TFormCheckboxField<T> & {
	label: string;
};

const FormCheckboxLabelField = <T extends object>({ control, name, label, className, ...props }: TFormCheckboxLabelFieldProps<T>) => {
	const { t } = useTranslation();

	return (
		<Field orientation="horizontal" className={cn(className)}>
			<FormCheckboxField control={control} name={name} {...props} className="mt-0.5" />
			<FieldLabel>{t(label)}</FieldLabel>
		</Field>
	);
};

export default FormCheckboxLabelField;
