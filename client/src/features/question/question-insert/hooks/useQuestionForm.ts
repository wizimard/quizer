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
import type { TestFull } from "@entities/test";
import type { Question } from "@entities/question";
import { normalizeQuestion } from "@entities/question";
import { DRAWER_KEYS, useSetDataDrawer, useSetLockDrawer, useSetUnlockDrawer } from "@shared/model";

const normalizeOptionsForm = (options: QuestionConfigOption[]): TQuestionFormOption[] => {
	return options.map((option) => ({
		id: option.id,
		optionId: option.id,
		value: option.value,
	}));
};

const getFormQuestionValues = (question: Question): TQuestionForm => {
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

// TODO: after create question need change question
export const useQuestionForm = (question: Question) => {
	const setData = useSetDataDrawer(DRAWER_KEYS.QUESTION_SETTINGS);
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

			reset(getFormQuestionValues(newQuestion));

			queryClient.setQueryData(["test", question!.testId], (test: TestFull) => {
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

			setData(newQuestion);
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
