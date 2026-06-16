import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { questionConfigFactory } from "@entities/question/model/questionConfig.factory";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IEditQuiz, editQuizValidationSchema, type TQuestionForm } from "../model/editQuizForm";
import type { QuizCreateRequestBody, QuizResponse, QuizUpdateRequestBody } from "@shared/api/generated";
import { api } from "@shared/api";
import { useEditQuizFormModes } from "./useEditQuizForm.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function createQuiz(formData: IEditQuiz) {
	const questions = formData.questions.map((question, index) => ({
		...question,
		quizId: "new_quiz",
		order: index,
	}));

	const body: QuizCreateRequestBody = { title: formData.title, questions };

	return api.quizPost(body);
}

interface IQuestionUpdate {
	add: QuizUpdateRequestBody["add"];
	update: QuizUpdateRequestBody["update"];
}

function updateQuiz(quizId: string, formData: IEditQuiz, deleteQuestion: string[]) {
	const { add, update }: IQuestionUpdate = formData.questions.reduce(
		(questions: IQuestionUpdate, currentQuestion: TQuestionForm, index: number) => {
			questions[currentQuestion.id.startsWith("new_") ? "add" : "update"].push({
				...currentQuestion,
				order: index,
				quizId,
			});

			return questions;
		},
		{ update: [], add: [] },
	);

	const body: QuizUpdateRequestBody = {
		id: quizId,
		title: formData.title,
		delete: deleteQuestion.filter((id) => id && !id.startsWith("new_")),
		add,
		update,
	};

	return api.quizPatch(body);
}

export function useEditQuizForm(quiz: QuizResponse, mode: useEditQuizFormModes) {
	const navigate = useNavigate();

	const {
		control,
		setValue,
		handleSubmit,
		reset,
		formState: { isSubmitting, isDirty },
	} = useForm<IEditQuiz>({
		defaultValues: {
			title: "",
			questions: [],
		},
		resolver: zodResolver(editQuizValidationSchema) as Resolver<IEditQuiz>,
	});

	useEffect(() => {
		reset({
			title: quiz.title,
			questions: quiz.questions.toSorted((question1, question2) => question1.order - question2.order).map((question) => ({ ...question, questionId: question.id })),
		});
	}, [quiz, reset]);

	useEffect(() => {
		control._disableForm(isSubmitting);
	}, [control, isSubmitting]);

	const { fields: fieldsQuestions, append: appendQuestion, remove, move: moveQuestionOrder } = useFieldArray({ control, name: "questions" });

	const [deletedQuestion, setDeletedQuestion] = useState<string[]>([]);

	const changeQuestionType = (index: number, type: string) => {
		const config = questionConfigFactory(type);

		if (!config) {
			return;
		}

		setValue(`questions.${index}.config`, config);
	};

	const changeQuestionOrder = (from: number, to: number) => {
		if (to >= fieldsQuestions.length || to < 0) {
			return;
		}
		moveQuestionOrder(from, to);
	};

	const removeQuestion = (index: number) => {
		setDeletedQuestion((prev) => [...prev, fieldsQuestions[index].questionId]);
		remove(index);
	};

	const submitHandler = handleSubmit(async (data: IEditQuiz) => {
		try {
			const response = await (mode === useEditQuizFormModes.CREATE ? createQuiz(data) : updateQuiz(quiz.id, data, deletedQuestion));

			navigate("/quiz/" + response.data.id);
		} catch (err) {
			console.error(err);
		}

		setDeletedQuestion([]);
	});

	return { control, fieldsQuestions, appendQuestion, removeQuestion, changeQuestionType, changeQuestionOrder, submitHandler, isSubmitting, isDirty };
}
