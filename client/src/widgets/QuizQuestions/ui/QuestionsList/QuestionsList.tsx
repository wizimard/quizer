import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { QuestionList } from "./ui/QuestionList";
import { api } from "@shared/api";
import type { QuestionChangeOrderRequestBody, QuestionResponse, QuizResponse } from "@shared/api/generated";
import { useQuestionDrawer } from "@widgets/QuizQuestions/store/question-drawer";

export interface IQuestionsListProps {
	questions: QuestionResponse[];
}

export const QuestionsList = ({ questions }: IQuestionsListProps) => {
	const queryClient = useQueryClient();

	const questionOrderChagenMutation = useMutation({
		mutationFn: ({ question, nextQuestionId, previousQuestionId }: QuestionChangeOrderRequestBody & { question: QuestionResponse }) => {
			return api.questionQuizIdQuestionsQuestionIdOrderPatch(question.quizId, question.id, {
				nextQuestionId,
				previousQuestionId,
			});
		},
		onSuccess: (response: AxiosResponse<QuizResponse>) => {
			queryClient.setQueryData(["quiz", response.data.id], response);
		},
		onError: (error: AxiosError) => {
			console.error(error, error.response);
		},
	});

	const setIsOpen = useQuestionDrawer((state) => state.setIsOpen);
	const setQuestion = useQuestionDrawer((state) => state.setQuestion);

	const handleClickEdit = (question: QuestionResponse) => {
		setQuestion(question);
		setIsOpen(true);
	};

	const handleClickUp = (question: QuestionResponse) => {
		const prevQuestion = questions[questions.findIndex((q) => q.id === question.id) - 1];

		questionOrderChagenMutation.mutate({ question, previousQuestionId: prevQuestion.id });
	};

	const handleClickDown = (question: QuestionResponse) => {
		const nextQuestion = questions[questions.findIndex((q) => q.id === question.id) + 1];

		questionOrderChagenMutation.mutate({ question, nextQuestionId: nextQuestion.id });
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
