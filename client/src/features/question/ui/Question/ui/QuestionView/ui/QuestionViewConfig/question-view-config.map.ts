import { QUESTION_TYPES } from "@entities/question";
import { QuestionViewInput } from "./ui/QuestionViewInput";
import { QuestionViewMultpleChoise } from "./ui/QuestionViewMultpleChoise";
import { QuestionViewSingleChoise } from "./ui/QuestionViewSingleChoise";

export const QUESTION_CONFIG_COMPONENTS = {
	[QUESTION_TYPES.INPUT]: QuestionViewInput,
	[QUESTION_TYPES.SIGNLE_CHOISE]: QuestionViewSingleChoise,
	[QUESTION_TYPES.MULTIPLE_CHOISE]: QuestionViewMultpleChoise,
};
