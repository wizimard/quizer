import { memo } from "react";
import type { Question } from "../../model/question.interface";
import { QuestionManageCardHeader } from "./QuestionManageCardHeader";
import { QuestionManageCardContent } from "./QuestionManageCardContent";
import { VerticalListItemCard } from "@shared/ui/card";

export interface QuestionManageCardProps {
	question: Question;
	isDisableUpButton: boolean;
	isDisableDownButton: boolean;
	onClickUp: (question: Question) => void;
	onClickDown: (question: Question) => void;
	onClickEdit: (question: Question) => void;
}

export const QuestionManageCard = memo(({ question, onClickUp, onClickDown, onClickEdit, isDisableUpButton, isDisableDownButton }: QuestionManageCardProps) => {
	const clickUpHandler = () => {
		onClickUp(question);
	};
	const clickDownHandler = () => {
		onClickDown(question);
	};
	const clickEditHandler = () => {
		onClickEdit(question);
	};

	return (
		<VerticalListItemCard
			header={
				<QuestionManageCardHeader
					clickUpHandler={clickUpHandler}
					clickDownHandler={clickDownHandler}
					clickEditHandler={clickEditHandler}
					isDisableUpButton={isDisableUpButton}
					isDisableDownButton={isDisableDownButton}
				/>
			}
			content={<QuestionManageCardContent {...question} />}
		/>
	);
});
