import { Controller, type Control, type Path, type FieldValues } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@shared/ui/kit/radio-group";
import { cn } from "@shared/lib/utils";

export type TFormRadioField<T extends FieldValues> = Omit<React.ComponentProps<typeof RadioGroupItem>, "value"> & {
	name: Path<T>;
	control: Control<T, unknown, T>;
	value?: string;
	checked?: boolean;
	onChange?: (value: string) => void;
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
								onChange(value);
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
