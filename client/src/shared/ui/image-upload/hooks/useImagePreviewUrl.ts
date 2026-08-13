import { useEffect, useMemo } from "react";
import { resolveApiAssetUrl } from "@shared/lib/resolveApiAssetUrl";

export function useImagePreviewUrl(file: File | null, existingUrl: string | null | undefined): string | null {
	const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

	useEffect(() => {
		return () => {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
		};
	}, [objectUrl]);

	if (objectUrl) {
		return objectUrl;
	}

	return resolveApiAssetUrl(existingUrl);
}
