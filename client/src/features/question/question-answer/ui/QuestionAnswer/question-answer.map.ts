import { QuestionAnswerInput } from "./ui/QuestionAnswerInput";
import { QuestionAnswerMultipleChoice } from "./ui/QuestionAnswerMultipleChoice";
import { QuestionAnswerSingleChoice } from "./ui/QuestionAnswerSingleChoice";
import { QUESTION_TYPES } from "@entities/question";

export const QUESTION_ANSWER_COMPONENTS = {
	[QUESTION_TYPES.INPUT]: QuestionAnswerInput,
	[QUESTION_TYPES.SIGNLE_CHOICE]: QuestionAnswerSingleChoice,
	[QUESTION_TYPES.MULTIPLE_CHOICE]: QuestionAnswerMultipleChoice,
} as const;

export type SupportedQuestionAnswerType = keyof typeof QUESTION_ANSWER_COMPONENTS;
