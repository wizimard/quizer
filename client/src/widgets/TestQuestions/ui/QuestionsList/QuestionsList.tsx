import { useCallback, useEffect, useRef } from "react";
import { QuestionListItem } from "./ui/QuestionListItem";
import { type Question } from "@entities/question";
import { useChangeQuestionOrder } from "@features/question/change-question-order";
import { DRAWER_KEYS, useOpenDrawer } from "@shared/model";

export interface IQuestionsListProps {
	questions: Question[];
}
// TODO: review
export const QuestionsList = ({ questions }: IQuestionsListProps) => {
	const { handleChangeQuestionOrder } = useChangeQuestionOrder();

	const openDrawer = useOpenDrawer(DRAWER_KEYS.QUESTION_SETTINGS);

	const questionsRef = useRef<Question[]>(questions);

	useEffect(() => {
		questionsRef.current = questions;
	}, [questions]);

	const handleClickEdit = useCallback(
		(question: Question) => {
			openDrawer(question);
		},
		[openDrawer],
	);

	const handleClickUp = useCallback(
		(question: Question) => {
			const prevQuestion = questionsRef.current[questionsRef.current.findIndex((q) => q.id === question.id) - 1];

			handleChangeQuestionOrder({ question, previousQuestionId: prevQuestion.id });
		},
		[handleChangeQuestionOrder],
	);

	const handleClickDown = useCallback(
		(question: Question) => {
			const nextQuestion = questionsRef.current[questionsRef.current.findIndex((q) => q.id === question.id) + 1];

			handleChangeQuestionOrder({ question, nextQuestionId: nextQuestion.id });
		},
		[handleChangeQuestionOrder],
	);

	return (
		<ul className="m-0 flex h-full w-full list-none flex-col gap-4 p-0">
			{questions.map((question, index) => (
				<QuestionListItem
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
