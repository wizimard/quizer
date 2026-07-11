import { enforceMaxLength } from "./max-length";
import { getPlainText, isPlainDom, setPlainText } from "./plain-text";
import { getCaretOffset, setCaretOffset } from "./selection";

type TReadAndEmitValueParams = {
	element: HTMLElement;
	value: string;
	onChange: (value: string) => void;
	maxLength?: number;
};

export function readAndEmitValue({ element, value, onChange, maxLength }: TReadAndEmitValueParams): void {
	const isFocused = document.activeElement === element;
	const caretOffset = isFocused ? getCaretOffset(element) : null;

	let nextValue = getPlainText(element);

	if (!isPlainDom(element)) {
		setPlainText(element, nextValue);

		if (caretOffset !== null) {
			setCaretOffset(element, Math.min(caretOffset, nextValue.length));
		}
	}

	if (maxLength !== undefined) {
		nextValue = enforceMaxLength(element, maxLength);
	} else {
		nextValue = getPlainText(element);
	}

	if (nextValue !== value) {
		onChange(nextValue);
	}
}
