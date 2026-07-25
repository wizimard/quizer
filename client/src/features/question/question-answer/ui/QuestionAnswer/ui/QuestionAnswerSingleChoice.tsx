import { useController } from "react-hook-form";
import type { QuestionAnswerFormComponentProps } from "../../../model/question-answer-form";
import { QuestionOption } from "@entities/question";
import type { QuestionExecuteConfigSingleChoice } from "@shared/api/generated";

export const QuestionAnswerSingleChoice = ({ options, control }: QuestionAnswerFormComponentProps<QuestionExecuteConfigSingleChoice>) => {
	const { field } = useController({ control, name: "optionId" });

	return (
		<ul className="m-0 flex w-full list-none flex-col gap-3 p-0" role="radiogroup">
			{options.map((option, index) => (
				<li key={option.id} className="m-0 w-full list-none p-0">
					<QuestionOption {...option} value={`${index + 1}. ${option.value}`} checked={option.id === field.value} onClick={field.onChange} />
				</li>
			))}
		</ul>
	);
};
