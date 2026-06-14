import type { IQuestion } from "@entities/question/model/question.interface";
import { type Control, type Path } from "react-hook-form";
import * as zod from "zod";

export type TQuestionForm = Omit<IQuestion, "quizId" | "order"> & {
	questionId: string;
};

export interface IEditQuiz {
	title: string;
	questions: TQuestionForm[];
}

const optionSchema = zod.object({
	id: zod.string(),
	value: zod.string().min(1, "Введите вариант ответа"),
});

const questionSchema = zod.object({
	id: zod.string(),
	questionId: zod.string(),
	description: zod.string().min(1, "Введите описание задачи"),
	config: zod.discriminatedUnion(
		"type",
		[
			zod.object({
				type: zod.literal("input"),
				answer: zod.string().min(1, "Введите ответ"),
				ignore_case: zod.boolean(),
			}),
			zod.object({
				type: zod.literal("single_choise"),
				answer: zod.string().min(1, "Выберите правильный ответ"),
				options: zod.array(optionSchema),
			}),
			zod.object({
				type: zod.literal("multiple_choise"),
				answer: zod.array(zod.string()).min(1, "Выберите правильные ответы"),
				options: zod.array(optionSchema),
			}),
		],
		{
			error: (issue) => {
				if (issue.code === "invalid_union") {
					return "Выберите тип вопроса";
				}
				return issue.message;
			},
		},
	),
});

export type TEditQuizQuestion = zod.infer<typeof questionSchema>;

export const editQuizValidationSchema = zod.object({
	title: zod.string().min(1, "Введите название викторины"),
	questions: zod.array(questionSchema).min(1, "Добавьте вопросы"),
});

export type TEditQuiz = zod.infer<typeof editQuizValidationSchema>;

export type IEditConfigComponentProps<T> = T & {
	control: Control<IEditQuiz, unknown, IEditQuiz>;
	name: Extract<Path<TEditQuiz>, `questions.${number}.config`>;
};
