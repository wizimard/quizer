import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IEditQuiz, editQuizValidationSchema, type TQuestionForm } from "../model/editQuizForm";
import type { QuizCreateRequestBody, QuizUpdateRequestBody } from "@shared/api/generated";
import { api } from "@shared/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TQuiz } from "@entities/quiz";
import { EditQuizFormModes } from "../model/editQuizFormModes";
import { createDefaultQuestionConfig } from "../model/questionDefaults";

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

export function useEditQuizForm(quiz: TQuiz, mode: EditQuizFormModes) {
	const navigate = useNavigate();

	const {
		control,
		setValue,
		handleSubmit,
		reset,
		clearErrors,
		formState: { isSubmitting, isDirty, errors },
	} = useForm<IEditQuiz>({
		defaultValues: {
			title: "",
			questions: [],
		},
		resolver: zodResolver(editQuizValidationSchema) as Resolver<IEditQuiz>,
		reValidateMode: "onSubmit",
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

	const { fields: fieldsQuestions, append: appendQuestionField, remove, move: moveQuestionOrder } = useFieldArray({ control, name: "questions" });

	const appendQuestion = (question: TQuestionForm) => {
		clearErrors("questions");
		appendQuestionField(question, { shouldFocus: false });
	};

	const [deletedQuestion, setDeletedQuestion] = useState<string[]>([]);

	const changeQuestionType = (index: number, type: string) => {
		const config = createDefaultQuestionConfig(type);

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
			const response = await (mode === EditQuizFormModes.CREATE ? createQuiz(data) : updateQuiz(quiz.id, data, deletedQuestion));

			navigate("/quiz/" + response.data.id);
		} catch (err) {
			console.error(err);
		}

		setDeletedQuestion([]);
	});

	return { control, fieldsQuestions, appendQuestion, removeQuestion, changeQuestionType, changeQuestionOrder, submitHandler, isSubmitting, isDirty, errors };
}
