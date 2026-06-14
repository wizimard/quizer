import { Radio, type RadioProps } from "@mui/material";
import { Controller, type Control, type Path } from "react-hook-form";

export type TFormRadioField<T> = RadioProps & {
	name: Path<T>;
	control: Control<T, unknown, T>;
};

const FormRadioField = <T extends object>({ control, name, sx, ...props }: TFormRadioField<T>) => {
	return <Controller name={name} control={control} render={({ field }) => <Radio {...field} {...props} sx={sx} />}></Controller>;
};

export default FormRadioField;
