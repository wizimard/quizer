import { forwardRef, useCallback, useRef } from "react";

import { useContentEditableSync } from "./hooks/useContentEditableSync";
import { useImeComposition } from "./hooks/useImeComposition";
import { insertPlainTypographyAtSelection } from "./lib/insert-plain-text";
import { getInsertableTypography } from "./lib/max-length";
import { readAndEmitValue } from "./lib/read-and-emit-value";
import { cn } from "@shared/lib/utils";

export type TAutoResizeTextFieldProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	maxLength?: number;
	maxHeightLines?: number;
};

const autoResizeTypographyFieldClassName = cn(
	"w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base leading-normal break-words whitespace-pre-wrap transition-colors outline-none",
	"min-h-[calc(3*1lh+1rem)]",
	"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
	"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
	"md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
	"data-[empty=true]:before:pointer-events-none data-[empty=true]:before:text-muted-foreground data-[empty=true]:before:content-[attr(data-placeholder)]",
);

const disabledClassName = "pointer-events-none cursor-not-allowed bg-input/50 opacity-50 dark:bg-input/80";

const AutoResizeTextField = forwardRef<HTMLDivElement, TAutoResizeTextFieldProps>(({ value, onChange, placeholder, disabled = false, className, maxLength, maxHeightLines }, ref) => {
	const elementRef = useRef<HTMLDivElement>(null);
	const { isComposingRef, handleCompositionStart, handleCompositionEnd: handleCompositionEndState } = useImeComposition();

	const { handleInput, handleCompositionEnd, handleBeforeInput, handleFocus, handleBlur } = useContentEditableSync({
		elementRef,
		value,
		onChange,
		isComposingRef,
		maxLength,
	});

	const setElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			elementRef.current = node;

			if (typeof ref === "function") {
				ref(node);
			} else if (ref) {
				ref.current = node;
			}
		},
		[ref],
	);

	const handleCompositionEndEvent = useCallback(() => {
		handleCompositionEndState();
		handleCompositionEnd();
	}, [handleCompositionEnd, handleCompositionEndState]);

	const handlePaste = useCallback(
		(event: React.ClipboardEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (disabled) {
				return;
			}

			const element = elementRef.current;
			if (!element) {
				return;
			}

			const pastedTypography = event.clipboardData.getData("text/plain").replace(/\r\n?/g, "\n");
			const insertableTypography = maxLength === undefined ? pastedTypography : getInsertableTypography(pastedTypography, element, maxLength);

			if (!insertableTypography) {
				return;
			}

			insertPlainTypographyAtSelection(insertableTypography);
			readAndEmitValue({ element, onChange, value, maxLength });
		},
		[disabled, maxLength, onChange, value],
	);

	return (
		<div
			ref={setElementRef}
			data-slot="auto-resize-text-field"
			role="textbox"
			aria-multiline="true"
			aria-disabled={disabled || undefined}
			aria-placeholder={placeholder}
			contentEditable={!disabled}
			suppressContentEditableWarning
			tabIndex={disabled ? -1 : 0}
			data-empty={value.length === 0}
			data-placeholder={placeholder ?? ""}
			style={maxHeightLines !== undefined ? { maxHeight: `calc(${maxHeightLines} * 1lh + 1rem)` } : undefined}
			className={cn(autoResizeTypographyFieldClassName, maxHeightLines !== undefined && "overflow-y-auto", disabled && disabledClassName, className)}
			onInput={handleInput}
			onBeforeInput={handleBeforeInput}
			onCompositionStart={handleCompositionStart}
			onCompositionEnd={handleCompositionEndEvent}
			onPaste={handlePaste}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	);
});

AutoResizeTextField.displayName = "AutoResizeTextField";

export default AutoResizeTextField;
