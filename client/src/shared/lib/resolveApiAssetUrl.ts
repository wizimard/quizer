const baseURL = import.meta.env.VITE_SERVER_URL as string | undefined;

export function resolveApiAssetUrl(relativeUrl: string | null | undefined): string | null {
	if (!relativeUrl) {
		return null;
	}

	if (/^https?:\/\//.test(relativeUrl)) {
		return relativeUrl;
	}

	const normalizedBase = baseURL?.replace(/\/$/, "") ?? "";
	return `${normalizedBase}${relativeUrl}`;
}
