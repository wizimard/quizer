import { type Question } from "@entities/question";
import { QuestionManageCard } from "@entities/question";
import { Typography } from "@shared/ui/typography";

export interface IQuestionListProps {
	question: Question;
	index: number;
	isLast: boolean;
	handleClickUp: (question: Question) => void;
	handleClickDown: (question: Question) => void;
	handleClickEdit: (question: Question) => void;
}

export const QuestionListItem = ({ question, index, isLast, handleClickEdit, handleClickUp, handleClickDown }: IQuestionListProps) => {
	return (
		<li key={question.id} className="flex w-full list-none gap-2.5">
			<Typography className="w-7" align="right">
				{index + 1}
			</Typography>
			<QuestionManageCard
				question={question}
				onClickEdit={handleClickEdit}
				onClickUp={handleClickUp}
				onClickDown={handleClickDown}
				isDisableDownButton={isLast}
				isDisableUpButton={index === 0}
			/>
		</li>
	);
};
