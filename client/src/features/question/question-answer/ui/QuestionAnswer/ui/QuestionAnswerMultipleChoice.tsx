import { useController } from "react-hook-form";
import type { QuestionAnswerFormComponentProps } from "../../../model/question-answer-form";
import { QuestionOption } from "@entities/question";
import type { QuestionExecuteConfigMultipleChoice } from "@shared/api/generated";

export const QuestionAnswerMultipleChoice = ({ control, options }: QuestionAnswerFormComponentProps<QuestionExecuteConfigMultipleChoice>) => {
	const { field } = useController({ control, name: "optionIds" });
	const selectedOptionIds = field.value ?? [];

	const handleToggle = (optionId: string) => {
		if (selectedOptionIds.includes(optionId)) {
			field.onChange(selectedOptionIds.filter((id) => id !== optionId));
			return;
		}

		field.onChange([...selectedOptionIds, optionId]);
	};

	return (
		<ul className="m-0 flex w-full list-none flex-col gap-3 p-0" role="group">
			{options.map((option, index) => (
				<li key={option.id} className="m-0 w-full list-none p-0">
					<QuestionOption {...option} value={`${index + 1}. ${option.value}`} checked={selectedOptionIds.includes(option.id)} onClick={handleToggle} />
				</li>
			))}
		</ul>
	);
};
