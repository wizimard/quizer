import type { IEditConfigComponentProps } from "@features/quiz/quiz-edit/model/editQuizForm";
import type { QuestionConfigSingleChoise } from "@shared/api/generated";
import { FormRadioField, FormTextField } from "@shared/ui/form";
import { useController, useWatch } from "react-hook-form";
import { cn } from "@shared/lib/utils";

export const SingleChoiseConfig = ({ options, control, name }: IEditConfigComponentProps<QuestionConfigSingleChoise>) => {
	const { field: answerField } = useController({ control, name: `${name}.answer` });

	const answer: string = useWatch({ control, name: `${name}.answer` }) as string;

	const handleChangeAnswer = (id: string) => {
		answerField.onChange(id);
	};

	return (
		<ul className="m-0 list-none p-0">
			{!!options &&
				options.map((option, index) => (
					<li key={option.id} className={cn("m-0 flex list-none items-start gap-2.5 rounded-md p-1.5", answer === option.id && "bg-green-100 dark:bg-green-950/40")}>
						<FormRadioField
							onChange={handleChangeAnswer.bind(this, option.id)}
							control={control}
							name={`${name}.answer`}
							className="mt-1"
							checked={answer === option.id}
							value={option.id}
						/>
						<FormTextField
							control={control}
							name={`${name}.options.${index}.value`}
							label="question_create_form.answer_option.label"
							placeholder="question_create_form.answer_option.placeholder"
						/>
					</li>
				))}
		</ul>
	);
};
