import { useQueryClient, useMutation } from "@tanstack/react-query";
import { type AxiosResponse, AxiosError } from "axios";
import type { UseFormSetError } from "react-hook-form";
import { createQuestion } from "../api/question-create";
import { updateQuestion } from "../api/question-update";
import type { TQuestionForm } from "../model/question-form";
import { normalizeQuestion, type Question } from "@entities/question";
import type { TestFull } from "@entities/test";
import type { QuestionResponse } from "@shared/api/generated";
import { QUESTION_NEW_ID, QUERY_KEYS } from "@shared/constant";
import { useSetDataDrawer, DRAWER_KEYS, useSetLockDrawer, useSetUnlockDrawer } from "@shared/model";

export const useInsertQuestion = (question: Question, setError: UseFormSetError<TQuestionForm>) => {
	const setData = useSetDataDrawer<{ question: Question; test: TestFull }>(DRAWER_KEYS.QUESTION_SETTINGS);
	const lock = useSetLockDrawer(DRAWER_KEYS.QUESTION_SETTINGS);
	const unlock = useSetUnlockDrawer(DRAWER_KEYS.QUESTION_SETTINGS);

	const queryClient = useQueryClient();

	const insertQuestion = useMutation({
		mutationFn: (data: TQuestionForm) => {
			lock();

			if (question.id === QUESTION_NEW_ID) {
				return createQuestion(question!, data);
			}
			return updateQuestion(question!, data);
		},
		onSuccess: (response: AxiosResponse<QuestionResponse>) => {
			const newQuestion = normalizeQuestion(response.data);

			queryClient.setQueryData([QUERY_KEYS.GET_FULL_TEST, question!.testId], (test: TestFull) => {
				if (!test) {
					return null;
				}

				let questions = test.questions;

				if (question.id === QUESTION_NEW_ID) {
					questions = [...questions, newQuestion];
				} else {
					questions = questions.map((question) => (question.id === newQuestion.id ? newQuestion : question));
				}

				return { ...test, questions };
			});

			setData((oldData) => ({
				test: oldData!.test,
				question: newQuestion,
			}));
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				console.error(error);
				setError("root", { message: "errors.unknown_error" });
				return;
			}

			setError("root", { message: error.response.data.message });
		},
		onSettled: () => {
			unlock();
		},
	});

	const handleInsertQuestion = (data: TQuestionForm) => {
		insertQuestion.mutate(data);
	};

	return {
		insertQuestion: handleInsertQuestion,
		isLoading: insertQuestion.isPending,
		error: insertQuestion.error,
	};
};
