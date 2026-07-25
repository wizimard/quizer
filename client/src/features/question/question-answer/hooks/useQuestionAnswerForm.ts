import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useEffect } from "react";
import { createDefaultAnswerFormValues, questionAnswerFormModelSchema, extractAnswerFormValues, type QuestionAnswerFormValues } from "../model/question-answer-form";
import { useAnswerQuestion } from "./useAnswerQuestion";
import type { QuestionExecution } from "@entities/question/model/question-execution.interface";

export const useQuestionAnswerForm = (question: QuestionExecution) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: {
			isValid,
			isSubmitting,
			errors: { root: formError },
		},
		setError,
	} = useForm<QuestionAnswerFormValues>({
		defaultValues: createDefaultAnswerFormValues(question.config.type),
		resolver: zodResolver(questionAnswerFormModelSchema) as Resolver<QuestionAnswerFormValues>,
		mode: "onChange",
	});

	const { answerQuestion, isLoading } = useAnswerQuestion(question.testId, question.id, setError);

	useEffect(() => {
		reset(createDefaultAnswerFormValues(question.config.type));
	}, [question.id, question.config.type, reset]);

	const submitHandler = handleSubmit((data) => {
		let answer: string = extractAnswerFormValues(data) as string;

		if (typeof answer === "object" && !!answer) {
			answer = JSON.stringify(answer);
		}

		answerQuestion({
			answer,
		});
	});

	const skipHandler = () => {
		answerQuestion({
			skipped: true,
		});
	};

	return { control, submitHandler, isValid, isLoading: isLoading || isSubmitting, formError, skip: skipHandler };
};
