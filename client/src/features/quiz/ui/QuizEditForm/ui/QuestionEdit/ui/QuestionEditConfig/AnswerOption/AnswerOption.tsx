import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import type { QuestionConfigOption } from "@shared/api/generated";
import { FormTextField } from "@shared/ui/form";
import { Trash2 } from "lucide-react";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export interface IAnswerOptionProps {
	children: React.ReactNode;
	option: QuestionConfigOption;
	index: number;
	isChecked: boolean;
	onRemove(index: number): void;
}

export const AnswerOption = ({ control, name, index, children, option, isChecked, onRemove }: IEditConfigComponentProps<IAnswerOptionProps>) => {
	const handleClickDelete = () => {
		onRemove(index);
	};

	return (
		<li key={option.id} className={cn("m-0 flex list-none items-start gap-2.5 rounded-md p-1.5", isChecked && "bg-green-100 dark:bg-green-950/40")}>
			{children}
			<FormTextField control={control} name={`${name}.options.${index}.value`} label="question_create_form.answer_option.label" placeholder="question_create_form.answer_option.placeholder" />
			<Button type="button" variant="ghost" size="icon-sm" className="mt-7 shrink-0" onClick={handleClickDelete}>
				<Trash2 className={cn(isChecked && "text-destructive")} />
			</Button>
		</li>
	);
};
