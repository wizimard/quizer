import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { QuestionList } from "./ui/QuestionList";
import type { QuestionChangeOrderRequestBody, QuestionResponse } from "@shared/api/generated";
import { normalizeQuestion, type Question } from "@entities/question";
import { questionApi } from "@shared/api";
import type { TestFull } from "@entities/test";
import { useQuestionDrawer } from "@widgets/TestQuestions/store/question-drawer";

export interface IQuestionsListProps {
	questions: Question[];
}
// TODO: review
export const QuestionsList = ({ questions }: IQuestionsListProps) => {
	const queryClient = useQueryClient();

	const questionOrderChagenMutation = useMutation({
		mutationFn: ({ question, next_question_id, previous_question_id }: QuestionChangeOrderRequestBody & { question: Question }) => {
			return questionApi.questionTestIdQuestionsQuestionIdOrderPatch(question.testId, question.id, {
				next_question_id,
				previous_question_id,
			});
		},
		onSuccess: (response: AxiosResponse<QuestionResponse[]>) => {
			queryClient.setQueryData(["test", response.data[0].test_id], (oldData: TestFull) => {
				return {
					...oldData,
					questions: response.data.map(normalizeQuestion),
				};
			});
		},
		onError: (error: AxiosError) => {
			console.error(error, error.response);
		},
	});

	const setIsOpen = useQuestionDrawer((state) => state.setIsOpen);
	const setQuestion = useQuestionDrawer((state) => state.setQuestion);

	const handleClickEdit = (question: Question) => {
		setQuestion(question);
		setIsOpen(true);
	};

	const handleClickUp = (question: Question) => {
		const prevQuestion = questions[questions.findIndex((q) => q.id === question.id) - 1];

		questionOrderChagenMutation.mutate({ question, previous_question_id: prevQuestion.id });
	};

	const handleClickDown = (question: Question) => {
		const nextQuestion = questions[questions.findIndex((q) => q.id === question.id) + 1];

		questionOrderChagenMutation.mutate({ question, next_question_id: nextQuestion.id });
	};

	return (
		<ul className="m-0 flex h-full w-full list-none flex-col gap-4 p-0">
			{questions.map((question, index) => (
				<QuestionList
					key={question.id}
					question={question}
					index={index}
					handleClickEdit={handleClickEdit}
					isLast={index === questions.length - 1}
					handleClickUp={handleClickUp}
					handleClickDown={handleClickDown}
				/>
			))}
		</ul>
	);
};
