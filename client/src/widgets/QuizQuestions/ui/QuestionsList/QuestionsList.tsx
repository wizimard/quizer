import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { QuestionList } from "./ui/QuestionList";
import { api } from "@shared/api";
import type { QuestionResponse, QuizResponse } from "@shared/api/generated";
import { useQuestionDrawer } from "@widgets/QuizQuestions/store/question-drawer";

export interface IQuestionsListProps {
	questions: QuestionResponse[];
}

export const QuestionsList = ({ questions }: IQuestionsListProps) => {
	const queryClient = useQueryClient();

	const questionOrderChagenMutation = useMutation({
		mutationFn: ({ question, newOrder }: { question: QuestionResponse; newOrder: number }) => {
			return api.questionQuizIdQuestionsQuestionIdPatch(question.quizId, question.id, {
				...question,
				order: newOrder,
			});
		},
		onSuccess: (response: AxiosResponse<QuestionResponse>) => {
			queryClient.setQueryData(["quiz", response.data.quizId], (old: QuizResponse) => {
				const oldOrder: number = old.questions.find((question) => question.id === response.data.id)!.order;

				old.questions.forEach((question) => {
					// меняем порядок у вопроса, с которым поменялись местами
					if (question.order === response.data.order) {
						question.order = oldOrder;
					}
					// меняем порядок у измененного вопроса
					if (question.id === response.data.id) {
						question.order = response.data.order;
					}
				});

				// сортируем вопросы по порядку
				old.questions.sort((a, b) => a.order - b.order);

				return {
					...old,
				};
			});
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
		const newOrder = questions[questions.findIndex((q) => q.id === question.id) - 1].order;

		questionOrderChagenMutation.mutate({ question, newOrder });
	};

	const handleClickDown = (question: QuestionResponse) => {
		const newOrder = questions[questions.findIndex((q) => q.id === question.id) + 1].order;

		questionOrderChagenMutation.mutate({ question, newOrder });
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
