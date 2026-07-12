import { Controller, type Control, type Path, type FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Field, FieldError, FieldLabel } from "@shared/ui/kit/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/kit/select";
import { cn } from "@shared/lib/utils";

export interface ISelectOption {
	value: string;
	text: string;
}

export type TFormSelectFieldChangeEvent = {
	target: {
		value: string;
		name: string;
	};
};

export type TFormSelectFieldProps<T extends FieldValues> = {
	name: Path<T>;
	id: string;
	label: string;
	control: Control<T, unknown, T>;
	options: ISelectOption[];
	placeholder?: string;
	required?: boolean;
	className?: string;
	onChange?: (event: TFormSelectFieldChangeEvent) => void;
};

export const FormSelectField = <T extends object>({ control, name, id, label, placeholder, required, className, options, onChange }: TFormSelectFieldProps<T>) => {
	const { t } = useTranslation();

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field, fieldState: { invalid, error } }) => (
				<Field className={cn("w-full min-w-[150px]", className)} data-invalid={invalid}>
					<FieldLabel htmlFor={id}>{t(label)}</FieldLabel>
					<Select
						value={(field.value as string) || undefined}
						onValueChange={(value) => {
							field.onChange(value);
							onChange?.({ target: { value, name: field.name } });
						}}
					>
						<SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
							<SelectValue placeholder={placeholder ? t(placeholder) : undefined} />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{t(option.text)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{invalid && error?.message && <FieldError>{t(error.message)}</FieldError>}
				</Field>
			)}
		/>
	);
};
