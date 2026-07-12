import { QUESTION_TYPES } from "@entities/question";
import type { ISelectOption } from "@shared/ui/form/FormSelectField";

export const QUESTION_TYPES_OPTIONS: ISelectOption[] = [
	{
		text: "question_types.input",
		value: QUESTION_TYPES.INPUT,
	},
	{
		text: "question_types.single_choise",
		value: QUESTION_TYPES.SIGNLE_CHOICE,
	},
	{
		text: "question_types.multiple_choise",
		value: QUESTION_TYPES.MULTIPLE_CHOICE,
	},
];
