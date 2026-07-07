import { QUESTION_TYPES } from "./question-types.enum";
import { QUESTION_NEW_ID } from "@shared/constant";
import type { QuestionResponse } from "@shared/api/generated";

export interface ICreateNewQuestionProps {
	quizId: string;
	order: number;
}

export const createNewQuestion = ({ quizId, order }: ICreateNewQuestionProps): QuestionResponse => {
	return {
		id: QUESTION_NEW_ID,
		quizId,
		description: "",
		sortKey: (order + 1) * 1000,
		config: {
			type: QUESTION_TYPES.INPUT,
			answer: "",
			ignore_case: true,
		},
	};
};
