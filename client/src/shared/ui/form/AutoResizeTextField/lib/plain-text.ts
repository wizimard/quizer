const ALLOWED_TAGS = new Set(["BR"]);

export function getPlainText(element: HTMLElement): string {
	return element.innerText.replace(/\r\n?/g, "\n");
}

export function setPlainText(element: HTMLElement, text: string): void {
	element.replaceChildren();

	if (!text) {
		return;
	}

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

	element.appendChild(fragment);
}

export function isPlainDom(element: HTMLElement): boolean {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);

	while (walker.nextNode()) {
		const node = walker.currentNode as HTMLElement;

		if (!ALLOWED_TAGS.has(node.tagName)) {
			return false;
		}

		if (node.attributes.length > 0) {
			return false;
		}
	}

	return true;
}
