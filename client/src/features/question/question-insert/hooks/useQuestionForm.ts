import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { getFormQuestionValues, questionFormModelSchema, type TQuestionForm } from "../model/question-form";
import { useInsertQuestion } from "./useInsertQuestion";
import { createDefaultQuestionConfig } from "@entities/question/model/questionConfigDefaults";
import type { TestFull } from "@entities/test";
import type { Question } from "@entities/question";

export const useQuestionForm = (question: Question, test: TestFull) => {
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
		disabled: test.isOpen,
	});

	const { insertQuestion, isLoading, error } = useInsertQuestion(question, setError);

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

	const onSubmit = handleSubmit((data) => {
		clearErrors("root");

		insertQuestion(data);
	});

	const resetForm = () => {
		reset(getFormQuestionValues(question));
		clearErrors();
	};

	return { control, handleSubmit: onSubmit, isLoading: isLoading || isSubmitting, isDirty, resetForm, formError, error };
};
