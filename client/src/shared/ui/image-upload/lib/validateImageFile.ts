export const DEFAULT_IMAGE_ACCEPT = "image/*";
export const DEFAULT_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type ImageFileValidationError = "image_upload.errors.invalid_type" | "image_upload.errors.too_large";

export function validateImageFile(
	file: File,
	options: {
		maxSizeBytes?: number;
		accept?: string;
	} = {},
): ImageFileValidationError | null {
	const maxSizeBytes = options.maxSizeBytes ?? DEFAULT_MAX_IMAGE_SIZE_BYTES;

	if (!file.type.startsWith("image/")) {
		return "image_upload.errors.invalid_type";
	}

	if (file.size > maxSizeBytes) {
		return "image_upload.errors.too_large";
	}

	return null;
}
