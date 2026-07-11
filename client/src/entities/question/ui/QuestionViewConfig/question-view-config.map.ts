import { QuestionViewInput } from "./ui/QuestionViewInput";
import { QuestionViewMultpleChoice } from "./ui/QuestionViewMultpleChoise";
import { QuestionViewSingleChoice } from "./ui/QuestionViewSingleChoise";
import { QUESTION_TYPES } from "@entities/question";

export const QUESTION_CONFIG_COMPONENTS = {
	[QUESTION_TYPES.INPUT]: QuestionViewInput,
	[QUESTION_TYPES.SIGNLE_CHOICE]: QuestionViewSingleChoice,
	[QUESTION_TYPES.MULTIPLE_CHOICE]: QuestionViewMultpleChoice,
};
