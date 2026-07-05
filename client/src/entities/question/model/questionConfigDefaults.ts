import { v4 as uuidV4 } from "uuid";
import { QUESTION_TYPES } from "@entities/question";
import type { QuestionRequestConfig } from "@shared/api/generated";

export function generateOptions(count: number = 4) {
	return Array(count)
		.fill(null)
		.map(() => ({ id: uuidV4(), value: "" }));
}

export function createDefaultQuestionConfig(type: string): QuestionRequestConfig | null {
	switch (type) {
		case QUESTION_TYPES.INPUT: {
			return {
				type: "input",
				answer: "",
				ignore_case: true,
			};
		}
		case QUESTION_TYPES.SIGNLE_CHOISE: {
			const options = generateOptions();

			return {
				type: "single_choise",
				answer: options[0].id,
				options: options,
			};
		}
		case QUESTION_TYPES.MULTIPLE_CHOISE: {
			return {
				type: "multiple_choise",
				answer: [],
				options: generateOptions(),
			};
		}
	}
	return null;
}
