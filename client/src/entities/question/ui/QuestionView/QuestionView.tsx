import { CircleChevronDown, CircleChevronUp, Pencil } from "lucide-react";
import { QuestionViewConfig } from "../QuestionViewConfig";
import { Text } from "@shared/ui/text";
import type { QuestionResponse } from "@shared/api/generated";
import { ButtonIcon } from "@shared/ui/button";

export interface IQuestionViewProps {
	question: QuestionResponse;
	isLast: boolean;
	handleClickEdit: (question: QuestionResponse) => void;
	handleClickUp?(question: QuestionResponse): void;
	handleClickDown?(question: QuestionResponse): void;
}

export const QuestionView = ({ question, handleClickEdit, handleClickUp, handleClickDown, isLast }: IQuestionViewProps) => {
	const clickUpHandler = () => {
		handleClickUp?.(question);
	};

	const clickDownHandler = () => {
		handleClickDown?.(question);
	};

	const clickEditHandler = () => {
		handleClickEdit(question);
	};

	return (
		<div className="relative flex w-full flex-col gap-2.5">
			<div className="flex items-center">
				<ButtonIcon title="Поднять вопрос к началу" onClick={clickUpHandler} disabled={question.order === 0}>
					<CircleChevronUp className="size-5" />
				</ButtonIcon>
				<ButtonIcon title="Опустить вопрос к концу" onClick={clickDownHandler} disabled={isLast}>
					<CircleChevronDown className="size-5" />
				</ButtonIcon>
				<ButtonIcon onClick={clickEditHandler} className="ml-auto" title="Редактировать вопрос">
					<Pencil className="size-5" />
				</ButtonIcon>
			</div>
			<Text className="pr-5">{question.description}</Text>
			<QuestionViewConfig config={question.config} />
		</div>
	);
};
