import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { questionFormModelSchema, type TQuestionForm, type TQuestionFormOption } from "../model/question-form";
import { createQuestion } from "../api/question-create";
import { updateQuestion } from "../api/question-update";
import type { QuestionConfigOption, QuestionResponse } from "@shared/api/generated";
import { QUESTION_NEW_ID } from "@shared/constant";
import { createDefaultQuestionConfig } from "@entities/question/model/questionConfigDefaults";
import type { TQuiz } from "@entities/quiz";

const normalizeOptionsForm = (options: QuestionConfigOption[]): TQuestionFormOption[] => {
	return options.map((option) => ({
		id: option.id,
		optionId: option.id,
		value: option.value,
	}));
};

const getFormQuestionValues = (question: QuestionResponse): TQuestionForm => {
	if (!("options" in question.config)) {
		return {
			description: question.description,
			config: question.config as TQuestionForm["config"],
		};
	}

	return {
		description: question.description,
		config: {
			...question.config,
			options: normalizeOptionsForm(question.config.options),
		} as TQuestionForm["config"],
	};
};

export const useQuestionForm = (question: QuestionResponse) => {
	const queryClient = useQueryClient();

	const insertQuestion = useMutation({
		mutationFn: (data: TQuestionForm) => {
			if (question.id === QUESTION_NEW_ID) {
				return createQuestion(question, data);
			}
			return updateQuestion(question, data);
		},
		onSuccess: (response: AxiosResponse<QuestionResponse, unknown, object>) => {
			reset(getFormQuestionValues(response.data));
			queryClient.setQueryData(["quiz", question.quizId], (quiz: TQuiz) => {
				if (!quiz) {
					return null;
				}

				let questions = quiz.questions;

				if (question.id === QUESTION_NEW_ID) {
					questions = [...questions, response.data];
				} else {
					questions = questions.map((question) => (question.id === response.data.id ? response.data : question));
				}

				return { ...quiz, questions };
			});
		},
		onError: (error) => {
			if (!(error instanceof AxiosError) || !error.response?.data?.message) {
				console.error(error);
				setError("root", { message: "errors.unknown_error" });
				return;
			}

			setError("root", { message: error.response.data.message });
		},
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: {
			isSubmitting,
			isDirty,
			errors: { root: formError },
			dirtyFields,
		},
		setValue,
		clearErrors,
		setError,
	} = useForm<TQuestionForm>({
		resolver: zodResolver(questionFormModelSchema),
		defaultValues: getFormQuestionValues(question),
	});

	const configType = useWatch({ control, name: "config.type" });

	useEffect(() => {
		reset(getFormQuestionValues(question));
	}, [question, reset]);

	useEffect(() => {
		if (!dirtyFields?.config?.type) {
			return;
		}

		const newConfig = createDefaultQuestionConfig(configType) as TQuestionForm["config"];

		if ("options" in newConfig) {
			newConfig.options.forEach((option) => {
				option.optionId = option.id;
			});
		}

		if (newConfig) {
			setValue("config", newConfig);
			clearErrors("config");
		}
	}, [configType, setValue, clearErrors, question.config.type, dirtyFields?.config?.type]);

	const onSubmit = handleSubmit(async (data) => {
		clearErrors("root");

		await insertQuestion.mutateAsync(data);
	});

	const resetForm = () => {
		reset(getFormQuestionValues(question));
		clearErrors();
	};

	return { control, handleSubmit: onSubmit, isLoading: insertQuestion.isPending || isSubmitting, isDirty, resetForm, formError };
};
