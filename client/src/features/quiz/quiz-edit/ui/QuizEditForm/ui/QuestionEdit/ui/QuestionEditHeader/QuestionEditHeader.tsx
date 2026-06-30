import type { UseFieldArrayRemove } from "react-hook-form";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@shared/ui/kit/button";

export interface IQuestionEditHeaderProps {
	index: number;
	isLast: boolean;
	changeQuestionOrder(from: number, to: number): void;
	removeQuestion: UseFieldArrayRemove;
}

export const QuestionEditHeader = ({ index, isLast, removeQuestion, changeQuestionOrder }: IQuestionEditHeaderProps) => {
	const handleDeleteQuestion = () => {
		removeQuestion(index);
	};

	const handleOrderUp = () => {
		changeQuestionOrder(index, index - 1);
	};

	const handleOrderDown = () => {
		changeQuestionOrder(index, index + 1);
	};

	return (
		<div className="w-full">
			{index > 0 && (
				<Button type="button" variant="ghost" size="icon-sm" aria-label="move question up" onClick={handleOrderUp}>
					<ChevronUp />
				</Button>
			)}
			{!isLast && (
				<Button type="button" variant="ghost" size="icon-sm" aria-label="move question down" onClick={handleOrderDown}>
					<ChevronDown />
				</Button>
			)}
			<Button type="button" variant="ghost" size="icon-sm" aria-label="delete" className="float-right" onClick={handleDeleteQuestion}>
				<Trash2 />
			</Button>
		</div>
	);
};
