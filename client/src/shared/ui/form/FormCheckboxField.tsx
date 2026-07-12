import { Controller, type Control, type Path, type FieldValues } from "react-hook-form";
import { Checkbox } from "@shared/ui/kit/checkbox";
import { cn } from "@shared/lib/utils";

export type TFormCheckboxField<T extends FieldValues> = Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange"> & {
	name?: Path<T>;
	control?: Control<T, unknown, T>;
	checked?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export const FormCheckboxField = <T extends object>({ control, name, className, checked, onChange, ...props }: TFormCheckboxField<T>) => {
	const checkbox = (fieldChecked?: boolean, fieldOnChange?: (value: boolean) => void) => (
		<Checkbox
			className={cn(className)}
			checked={checked ?? fieldChecked}
			onCheckedChange={(value) => {
				const nextChecked = value === true;
				if (onChange) {
					onChange({ target: { checked: nextChecked } } as React.ChangeEvent<HTMLInputElement>, nextChecked);
					return;
				}
				fieldOnChange?.(nextChecked);
			}}
			{...props}
		/>
	);

	if (control && name) {
		return <Controller name={name} control={control} render={({ field }) => checkbox(field.value, field.onChange)} />;
	}

	return checkbox();
};
