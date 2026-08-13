import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ImageUpload } from "./ImageUpload";
import { useImagePreviewUrl } from "./hooks/useImagePreviewUrl";

type ImageUploadFieldRendererProps = {
	value: File | null;
	onChange: (file: File | null) => void;
	disabled?: boolean;
	existingImageUrl?: string | null;
	label?: string;
	hint?: string;
	className?: string;
	error?: string;
};

const ImageUploadFieldRenderer = ({ value, onChange, disabled, existingImageUrl, label, hint, className, error }: ImageUploadFieldRendererProps) => {
	const previewUrl = useImagePreviewUrl(value, existingImageUrl);

	return <ImageUpload value={value} previewUrl={previewUrl} onChange={onChange} disabled={disabled} label={label} hint={hint} className={className} error={error} />;
};

export type FormImageUploadFieldProps<T extends FieldValues> = {
	control: Control<T, unknown, T>;
	name: Path<T>;
	existingImageUrl?: string | null;
	label?: string;
	hint?: string;
	className?: string;
	disabled?: boolean;
};

export const FormImageUploadField = <T extends FieldValues>({ control, name, existingImageUrl, label, hint, className, disabled }: FormImageUploadFieldProps<T>) => {
	const { t } = useTranslation();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<ImageUploadFieldRenderer
					value={field.value ?? null}
					onChange={field.onChange}
					disabled={disabled ?? field.disabled}
					existingImageUrl={existingImageUrl}
					label={label}
					hint={hint}
					className={className}
					error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
				/>
			)}
		/>
	);
};
