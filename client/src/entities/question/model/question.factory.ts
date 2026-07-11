import { QUESTION_TYPES } from "./question-types.enum";
import type { Question } from "./question.interface";
import { QUESTION_NEW_ID } from "@shared/constant";

export interface ICreateNewQuestionProps {
	testId: string;
	order: number;
}

export const createNewQuestion = ({ testId, order }: ICreateNewQuestionProps): Question => {
	return {
		id: QUESTION_NEW_ID,
		testId: testId,
		description: "",
		sortKey: (order + 1) * 1000,
		config: {
			type: QUESTION_TYPES.INPUT,
			answer: "",
			ignore_case: true,
		},
	};
};
