import { getPlainTypography } from "./plain-text";

export function getCaretOffset(element: HTMLElement): number {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) {
		return 0;
	}

	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(element);
	preCaretRange.setEnd(range.endContainer, range.endOffset);

	const container = document.createElement("div");
	container.appendChild(preCaretRange.cloneContents());

	return getPlainTypography(container).length;
}

export function setCaretOffset(element: HTMLElement, offset: number): void {
	const selection = window.getSelection();
	if (!selection) {
		return;
	}

	const range = document.createRange();
	let currentOffset = 0;

	const placeCaret = (node: Node, nodeOffset: number): void => {
		range.setStart(node, nodeOffset);
		range.collapse(true);
	};

	const walk = (node: Node): boolean => {
		if (node.nodeType === Node.TEXT_NODE) {
			const length = node.textContent?.length ?? 0;

			if (currentOffset + length >= offset) {
				placeCaret(node, offset - currentOffset);
				return true;
			}

			currentOffset += length;
			return false;
		}

		if (node.nodeName === "BR") {
			if (currentOffset === offset) {
				placeCaret(node, 0);
				return true;
			}

			currentOffset += 1;
			return false;
		}

		for (const child of Array.from(node.childNodes)) {
			if (walk(child)) {
				return true;
			}
		}

		return false;
	};

	if (!walk(element)) {
		range.selectNodeContents(element);
		range.collapse(false);
	}

	selection.removeAllRanges();
	selection.addRange(range);
}
