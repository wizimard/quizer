import type { QuestionAnswerFormComponentProps } from "../../../model/question-answer-form";
import type { QuestionExecuteConfigInput } from "@shared/api/generated";
import { FormTextField } from "@shared/ui/form";

export const QuestionAnswerInput = ({ control }: QuestionAnswerFormComponentProps<QuestionExecuteConfigInput>) => {
	return (
		<FormTextField
			control={control}
			name="value"
			placeholder="test_execute.question.input_placeholder"
			autoComplete="off"
			className="w-full"
			inputClassName="h-12 rounded-xl border-emerald-200 bg-white text-base focus:border-emerald-700 focus-visible:border-emerald-700 focus:ring-emerald-700/20 focus-visible:ring-emerald-700/20 dark:border-emerald-900/40 dark:bg-emerald-950/20"
			multiline
		/>
	);
};
