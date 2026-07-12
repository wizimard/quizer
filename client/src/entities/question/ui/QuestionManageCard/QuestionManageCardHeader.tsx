import { CircleChevronUp, CircleChevronDown, Pencil } from "lucide-react";
import { ButtonIcon } from "@shared/ui/button";

export interface QuestionManageCardHeaderProps {
	clickUpHandler: () => void;
	clickDownHandler: () => void;
	clickEditHandler: () => void;
	isDisableUpButton: boolean;
	isDisableDownButton: boolean;
}

export const QuestionManageCardHeader = ({ clickUpHandler, clickDownHandler, clickEditHandler, isDisableUpButton, isDisableDownButton }: QuestionManageCardHeaderProps) => {
	return (
		<div className="w-full flex items-center">
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
	);
};
