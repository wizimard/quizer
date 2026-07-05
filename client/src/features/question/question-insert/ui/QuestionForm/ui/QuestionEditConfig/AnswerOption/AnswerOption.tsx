import { Trash2 } from "lucide-react";
import type { QuestionConfigOption } from "@shared/api/generated";
import { FormTextField } from "@shared/ui/form";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";
import type { TQuestionFormComponentProps } from "@features/question/question-insert/model/question-form";

export interface IAnswerOptionProps {
	children: React.ReactNode;
	option: QuestionConfigOption;
	index: number;
	isChecked: boolean;
	onRemove(): void;
}

export const AnswerOption = ({ control, index, children, option, isChecked, onRemove }: TQuestionFormComponentProps<IAnswerOptionProps>) => {
	return (
		<li key={option.id} className="m-0 flex list-none items-start gap-2.5 rounded-md p-1.5">
			{children}
			<FormTextField
				control={control}
				name={`config.options.${index}.value`}
				label="question_form.answer_option.label"
				placeholder="question_form.answer_option.placeholder"
				multiline
				className="w-[267px]"
			/>
			<Button type="button" variant="ghost" size="icon-sm" className="shrink-0" onClick={onRemove}>
				<Trash2 className={cn(isChecked && "text-destructive")} />
			</Button>
		</li>
	);
};
