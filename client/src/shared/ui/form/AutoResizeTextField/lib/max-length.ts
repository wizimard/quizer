import { getCaretOffset, setCaretOffset } from "./selection";
import { getPlainText, setPlainText } from "./plain-text";

export function getSelectedTextLength(root: HTMLElement): number {
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

	return getPlainText(container).length;
}

export function getInsertableText(text: string, element: HTMLElement, maxLength: number): string {
	const currentText = getPlainText(element);
	const selectedLength = getSelectedTextLength(element);
	const availableLength = maxLength - (currentText.length - selectedLength);

	if (availableLength <= 0) {
		return "";
	}

	return text.slice(0, availableLength);
}

export function enforceMaxLength(element: HTMLElement, maxLength: number): string {
	const text = getPlainText(element);

	if (text.length <= maxLength) {
		return text;
	}

	const caretOffset = getCaretOffset(element);
	const truncatedText = text.slice(0, maxLength);

	setPlainText(element, truncatedText);
	setCaretOffset(element, Math.min(caretOffset, maxLength));

	return truncatedText;
}
