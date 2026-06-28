import { Controller, type Control, type Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Field, FieldError, FieldLabel } from "@shared/ui/kit/field";
import { Input } from "@shared/ui/kit/input";
import { cn } from "@shared/lib/utils";

export type TFormTextFieldProps<T> = Omit<React.ComponentProps<typeof Input>, "name"> & {
	name: Path<T>;
	control: Control<T, unknown, T>;
	label?: string;
};

const FormTextField = <T extends object>({ control, name, type = "text", required, className, label, placeholder, id, ...props }: TFormTextFieldProps<T>) => {
	const { t } = useTranslation();

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field, fieldState }) => (
				<Field className={cn("w-full", className)} data-invalid={fieldState.invalid}>
					{label && <FieldLabel htmlFor={id ?? name}>{t(label)}</FieldLabel>}
					<Input id={id ?? name} type={type} aria-invalid={fieldState.invalid} placeholder={placeholder ? t(placeholder) : undefined} {...field} {...props} />
					{fieldState.invalid && fieldState.error?.message && <FieldError>{t(fieldState.error.message)}</FieldError>}
				</Field>
			)}
		/>
	);
};

export default FormTextField;
