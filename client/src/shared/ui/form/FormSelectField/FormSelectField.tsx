import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectProps, type SxProps, type Theme } from "@mui/material";
import { Controller, type Control, type Path } from "react-hook-form";

export interface ISelectOption {
	value: string;
	text: string;
}

export type TFormTextFieldProps<T> = SelectProps & {
	name: Path<T>;
	id: string;
	label: string;
	control: Control<T, unknown, T>;
	options: ISelectOption[];
};

export const FormSelectField = <T extends object>({ control, name, id, label, required, sx, options, ...props }: TFormTextFieldProps<T>) => {
	const styles: SxProps<Theme> = {
		...(sx || {}),
		width: "100%",
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field, fieldState: { invalid, error } }) => (
				<FormControl variant="standard" sx={{ width: "100%", minWidth: "150px" }} error={invalid}>
					<InputLabel id={id}>{label}</InputLabel>
					<Select labelId={id} id={id} {...field} error={invalid} sx={styles} {...props}>
						{options.map((option) => (
							<MenuItem value={option.value}>{option.text}</MenuItem>
						))}
					</Select>
					{invalid && !!error.message && <FormHelperText>{error.message}</FormHelperText>}
				</FormControl>
			)}
		></Controller>
	);
};
