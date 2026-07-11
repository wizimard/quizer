export function insertPlainTextAtSelection(text: string): void {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) {
		return;
	}

	const range = selection.getRangeAt(0);
	range.deleteContents();

	const fragment = document.createDocumentFragment();
	const lines = text.split("\n");

	for (let index = 0; index < lines.length; index += 1) {
		if (index > 0) {
			fragment.appendChild(document.createElement("br"));
		}

		const line = lines[index];
		if (line) {
			fragment.appendChild(document.createTextNode(line));
		}
	}

	const lastNode = fragment.lastChild;
	range.insertNode(fragment);

	if (lastNode) {
		range.setStartAfter(lastNode);
	} else {
		range.collapse(true);
	}

	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}
