import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/kit/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@shared/ui/kit/field";
import { DEFAULT_IMAGE_ACCEPT, DEFAULT_MAX_IMAGE_SIZE_BYTES, validateImageFile, type ImageFileValidationError } from "./lib/validateImageFile";

export interface ImageUploadProps {
	value: File | null;
	previewUrl: string | null;
	onChange: (file: File | null) => void;
	disabled?: boolean;
	label?: string;
	hint?: string;
	error?: string;
	accept?: string;
	maxSizeBytes?: number;
	className?: string;
}

export const ImageUpload = ({
	value,
	previewUrl,
	onChange,
	disabled = false,
	label,
	hint,
	error,
	accept = DEFAULT_IMAGE_ACCEPT,
	maxSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
	className,
}: ImageUploadProps) => {
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [localError, setLocalError] = useState<ImageFileValidationError | null>(null);

	const handleFile = (file: File | null) => {
		if (!file) {
			setLocalError(null);
			onChange(null);
			return;
		}

		const validationError = validateImageFile(file, { maxSizeBytes, accept });

		if (validationError) {
			setLocalError(validationError);
			return;
		}

		setLocalError(null);
		onChange(file);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		handleFile(file);
		event.target.value = "";
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();

		if (!disabled) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);

		if (disabled) {
			return;
		}

		const file = event.dataTransfer.files?.[0] ?? null;
		handleFile(file);
	};

	const openFileDialog = () => {
		if (!disabled) {
			inputRef.current?.click();
		}
	};

	const clearSelection = () => {
		handleFile(null);
	};

	const displayError = error ?? (localError ? t(localError) : undefined);

	return (
		<Field className={cn("w-full", className)} data-invalid={Boolean(displayError)}>
			{label && <FieldLabel>{t(label)}</FieldLabel>}
			{hint && <FieldDescription>{t(hint)}</FieldDescription>}

			<input ref={inputRef} type="file" accept={accept} className="sr-only" disabled={disabled} onChange={handleInputChange} />

			{previewUrl ? (
				<div className="group relative overflow-hidden rounded-xl border border-border bg-muted/30">
					<img src={previewUrl} alt={t("image_upload.preview_alt")} className="max-h-56 w-full object-contain bg-zinc-50" />
					<div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
						<span className="truncate text-xs text-white">{value?.name ?? t("image_upload.current_image")}</span>
						<div className="flex shrink-0 gap-1.5">
							<Button type="button" size="sm" variant="secondary" disabled={disabled} onClick={openFileDialog}>
								<Upload className="size-3.5" />
								{t("image_upload.replace")}
							</Button>
							{value && (
								<Button type="button" size="sm" variant="destructive" disabled={disabled} onClick={clearSelection}>
									<X className="size-3.5" />
								</Button>
							)}
						</div>
					</div>
				</div>
			) : (
				<div
					role="button"
					tabIndex={disabled ? -1 : 0}
					onClick={openFileDialog}
					onKeyDown={(event) => {
						if ((event.key === "Enter" || event.key === " ") && !disabled) {
							event.preventDefault();
							openFileDialog();
						}
					}}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={cn(
						"flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
						"border-border bg-muted/20 hover:border-primary/40 hover:bg-primary/5",
						isDragging && "border-primary bg-primary/10",
						disabled && "cursor-not-allowed opacity-50",
						displayError && "border-destructive/60 bg-destructive/5",
					)}
				>
					<div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
						<ImagePlus className="size-5" />
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-foreground">{t("image_upload.dropzone_title")}</p>
						<p className="text-xs text-muted-foreground">{t("image_upload.dropzone_hint")}</p>
					</div>
				</div>
			)}

			{displayError && <FieldError>{displayError}</FieldError>}
		</Field>
	);
};
