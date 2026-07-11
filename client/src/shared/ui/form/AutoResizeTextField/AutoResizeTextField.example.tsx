import { useState } from "react";

import { AutoResizeTextField } from "./index";

/**
 * Пример controlled-использования AutoResizeTextField.
 */
export const AutoResizeTextFieldExample = () => {
	const [value, setValue] = useState("");

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<AutoResizeTextField value={value} onChange={setValue} placeholder="Введите текст..." maxLength={500} />
			<p className="text-sm text-muted-foreground">Символов: {value.length}</p>
		</div>
	);
};
