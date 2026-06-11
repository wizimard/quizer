import { type CheckboxProps, Checkbox } from "@mui/material";
import { Controller, type Control, type Path } from "react-hook-form";

export type TFormCheckboxField<T> = CheckboxProps & {
	name: Path<T>;
	control: Control<T, unknown, T>;
};

const FormCheckboxField = <T extends object>({ control, name, sx, ...props }: TFormCheckboxField<T>) => {
	return <Controller name={name} control={control} render={({ field }) => <Checkbox {...field} {...props} sx={sx} />}></Controller>;
};

export default FormCheckboxField;
