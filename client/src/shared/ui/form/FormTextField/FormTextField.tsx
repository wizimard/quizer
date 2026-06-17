import { TextField, type SxProps, type TextFieldProps, type Theme } from "@mui/material";
import { Controller, type Control, type Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type TFormTextFieldProps<T> = TextFieldProps & {
	name: Path<T>;
	control: Control<T, unknown, T>;
	label: string;
};

const FormTextField = <T extends object>({ control, name, type = "text", required, sx, label, placeholder, ...props }: TFormTextFieldProps<T>) => {
	const { t } = useTranslation();

	const styles: SxProps<Theme> = {
		...(sx || {}),
		width: "100%",
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field, fieldState }) => (
				<TextField
					type={type}
					{...field}
					{...props}
					variant="standard"
					error={fieldState.invalid}
					helperText={fieldState.invalid ? t(fieldState.error.message) : ""}
					sx={styles}
					label={label && t(label)}
					placeholder={placeholder && t(placeholder)}
				/>
			)}
		></Controller>
	);
};

export default FormTextField;
