import { CircleChevronDown, CircleChevronUp, Pencil } from "lucide-react";
import { QuestionViewConfig } from "../QuestionViewConfig";
import { Text } from "@shared/ui/text";
import type { Question } from "@entities/question";
import { ButtonIcon } from "@shared/ui/button";

export interface QuestionViewProps {
	question: Question;
	isDisableDownButton: boolean;
	isDisableUpButton: boolean;
	handleClickEdit: (question: Question) => void;
	handleClickUp?(question: Question): void;
	handleClickDown?(question: Question): void;
}

// TODO: translate
export const QuestionView = ({ question, handleClickEdit, handleClickUp, handleClickDown, isDisableDownButton, isDisableUpButton }: QuestionViewProps) => {
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
				<ButtonIcon title="Поднять вопрос к началу" onClick={clickUpHandler} disabled={isDisableUpButton}>
					<CircleChevronUp className="size-5" />
				</ButtonIcon>
				<ButtonIcon title="Опустить вопрос к концу" onClick={clickDownHandler} disabled={isDisableDownButton}>
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
