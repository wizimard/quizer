import { QUESTION_TYPES } from "@entities/question";
import type { ISelectOption } from "@shared/ui/form/FormSelectField/FormSelectField";

export const QUESTION_TYPES_OPTIONS: ISelectOption[] = [
	{
		text: "question_form.type.label",
		value: QUESTION_TYPES.INPUT,
	},
	{
		text: "question_form.type.label",
		value: QUESTION_TYPES.SIGNLE_CHOISE,
	},
	{
		text: "question_form.type.label",
		value: QUESTION_TYPES.MULTIPLE_CHOISE,
	},
];
