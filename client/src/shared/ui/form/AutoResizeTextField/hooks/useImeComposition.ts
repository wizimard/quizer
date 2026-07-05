import { useCallback, useRef } from "react";

export function useImeComposition() {
	const isComposingRef = useRef(false);

	const handleCompositionStart = useCallback(() => {
		isComposingRef.current = true;
	}, []);

	const handleCompositionEnd = useCallback(() => {
		isComposingRef.current = false;
	}, []);

	return {
		isComposingRef,
		handleCompositionStart,
		handleCompositionEnd,
	};
}
