import { getCaretOffset, setCaretOffset } from "./selection";
import { getPlainTypography, setPlainTypography } from "./plain-text";

export function getSelectedTypographyLength(root: HTMLElement): number {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
		return 0;
	}

	const range = selection.getRangeAt(0);
	if (!root.contains(range.commonAncestorContainer)) {
		return 0;
	}
	const container = document.createElement("div");
	container.appendChild(range.cloneContents());

	return getPlainTypography(container).length;
}

export function getInsertableTypography(text: string, element: HTMLElement, maxLength: number): string {
	const currentTypography = getPlainTypography(element);
	const selectedLength = getSelectedTypographyLength(element);
	const availableLength = maxLength - (currentTypography.length - selectedLength);

	if (availableLength <= 0) {
		return "";
	}

	return text.slice(0, availableLength);
}

export function enforceMaxLength(element: HTMLElement, maxLength: number): string {
	const text = getPlainTypography(element);

	if (text.length <= maxLength) {
		return text;
	}

	const caretOffset = getCaretOffset(element);
	const truncatedTypography = text.slice(0, maxLength);

	setPlainTypography(element, truncatedTypography);
	setCaretOffset(element, Math.min(caretOffset, maxLength));

	return truncatedTypography;
}
