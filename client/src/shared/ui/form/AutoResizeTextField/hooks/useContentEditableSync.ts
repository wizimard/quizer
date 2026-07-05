import { useCallback, useLayoutEffect, useRef, type MutableRefObject, type RefObject } from "react";

import { getSelectedTextLength } from "../lib/max-length";
import { getPlainText, setPlainText } from "../lib/plain-text";
import { readAndEmitValue } from "../lib/read-and-emit-value";
import { getCaretOffset, setCaretOffset } from "../lib/selection";

type TUseContentEditableSyncParams = {
	elementRef: RefObject<HTMLDivElement | null>;
	value: string;
	onChange: (value: string) => void;
	isComposingRef: MutableRefObject<boolean>;
	maxLength?: number;
};

export function useContentEditableSync({ elementRef, value, onChange, isComposingRef, maxLength }: TUseContentEditableSyncParams) {
	const isFocusedRef = useRef(false);

	const readValueFromDom = useCallback(() => {
		const element = elementRef.current;
		if (!element) {
			return;
		}

		readAndEmitValue({ element, value, onChange, maxLength });
	}, [elementRef, maxLength, onChange, value]);

	useLayoutEffect(() => {
		const element = elementRef.current;
		if (!element || isComposingRef.current) {
			return;
		}

		const domValue = getPlainText(element);
		if (domValue === value) {
			return;
		}

		const caretOffset = isFocusedRef.current ? getCaretOffset(element) : null;

		setPlainText(element, value);

		if (caretOffset !== null) {
			setCaretOffset(element, Math.min(caretOffset, value.length));
		}
	}, [elementRef, isComposingRef, value]);

	const handleInput = useCallback(() => {
		if (isComposingRef.current) {
			return;
		}

		readValueFromDom();
	}, [isComposingRef, readValueFromDom]);

	const handleCompositionEnd = useCallback(() => {
		readValueFromDom();
	}, [readValueFromDom]);

	const handleBeforeInput = useCallback(
		(event: React.FormEvent<HTMLDivElement>) => {
			if (maxLength === undefined || isComposingRef.current) {
				return;
			}

			const nativeEvent = event.nativeEvent as InputEvent;
			const inputType = nativeEvent.inputType;

			if (inputType.startsWith("delete") || inputType === "insertLineBreak" || inputType === "insertParagraph") {
				return;
			}

			const data = nativeEvent.data;
			if (!data) {
				return;
			}

			const element = elementRef.current;
			if (!element) {
				return;
			}

			const currentText = getPlainText(element);
			const selectedLength = getSelectedTextLength(element);
			const availableLength = maxLength - (currentText.length - selectedLength);

			if (availableLength <= 0) {
				event.preventDefault();
			}
		},
		[elementRef, isComposingRef, maxLength],
	);

	const handleFocus = useCallback(() => {
		isFocusedRef.current = true;
	}, []);

	const handleBlur = useCallback(() => {
		isFocusedRef.current = false;
		readValueFromDom();
	}, [readValueFromDom]);

	return {
		handleInput,
		handleCompositionEnd,
		handleBeforeInput,
		handleFocus,
		handleBlur,
	};
}
