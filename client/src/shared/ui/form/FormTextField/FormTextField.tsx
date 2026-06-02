import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, type Control, type Path } from "react-hook-form";

export type TFormTextFieldProps<T> = TextFieldProps & {
	name: Path<T>;
	control: Control<T, unknown, T>;
};

const FormTextField = <T extends object>({ control, name, type = "text", required, ...props }: TFormTextFieldProps<T>) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field, fieldState }) => (
				<TextField type={type} {...field} {...props} variant="standard" error={fieldState.invalid} helperText={fieldState.invalid ? fieldState.error.message : ""} />
			)}
		></Controller>
	);
};

export default FormTextField;
