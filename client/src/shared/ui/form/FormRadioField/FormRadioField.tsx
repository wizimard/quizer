import { Controller, type Control, type Path } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@shared/ui/kit/radio-group";
import { cn } from "@shared/lib/utils";

export type TFormRadioField<T> = Omit<React.ComponentProps<typeof RadioGroupItem>, "value"> & {
	name: Path<T>;
	control: Control<T, unknown, T>;
	value?: string;
	checked?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const FormRadioField = <T extends object>({ control, name, className, checked, onChange, value = "on", ...props }: TFormRadioField<T>) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const isChecked = checked ?? field.value === value;

				return (
					<RadioGroup
						className="w-auto shrink-0"
						value={isChecked ? value : ""}
						onValueChange={() => {
							if (onChange) {
								onChange({ target: { value, name: field.name } } as React.ChangeEvent<HTMLInputElement>);
								return;
							}
							field.onChange(value);
						}}
					>
						<RadioGroupItem value={value} className={cn(className)} {...props} />
					</RadioGroup>
				);
			}}
		/>
	);
};

export default FormRadioField;
