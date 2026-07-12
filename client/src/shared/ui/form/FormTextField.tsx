import { Controller, type Control, type Path, type FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AutoResizeTextField } from "./AutoResizeTextField";
import { Field, FieldError, FieldLabel } from "@shared/ui/kit/field";
import { Input } from "@shared/ui/kit/input";
import { cn } from "@shared/lib/utils";

export type TFormTextFieldProps<T extends FieldValues> = Omit<React.ComponentProps<typeof Input>, "name"> & {
	name: Path<T>;
	control: Control<T, unknown, T>;
	label?: string;
	multiline?: boolean;
};

export const FormTextField = <T extends object>({ control, name, type = "text", required, className, label, placeholder, id, multiline, ...props }: TFormTextFieldProps<T>) => {
	const { t } = useTranslation();
	const fieldId = id ?? name;

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field: { ref, ...field }, fieldState }) => (
				<Field className={cn("w-full", className)} data-invalid={fieldState.invalid}>
					{label && <FieldLabel htmlFor={fieldId}>{t(label)}</FieldLabel>}
					{multiline ? (
						<AutoResizeTextField
							ref={ref as React.Ref<HTMLDivElement>}
							value={String(field.value ?? "")}
							onChange={field.onChange}
							placeholder={placeholder ? t(placeholder) : undefined}
							disabled={field.disabled}
						/>
					) : (
						<Input id={fieldId} type={type} ref={ref} aria-invalid={fieldState.invalid} placeholder={placeholder ? t(placeholder) : undefined} {...field} {...props} />
					)}
					{fieldState.invalid && fieldState.error?.message && <FieldError>{t(fieldState.error.message)}</FieldError>}
				</Field>
			)}
		/>
	);
};
