import { useController, useWatch } from "react-hook-form";
import type { QuestionConfigSingleChoice } from "@shared/api/generated";
import { FormRadioField, FormTextField } from "@shared/ui/form";
import type { QuestionFormComponentProps } from "@features/question/question-insert/model/question-form";

export const SingleChoiseConfig = ({ options, control }: QuestionFormComponentProps<QuestionConfigSingleChoice>) => {
	const { field: answerField } = useController({ control, name: "config.answer" });

	const answer: string = useWatch({ control, name: "config.answer" }) as string;

	const handleChangeAnswer = (id: string) => {
		answerField.onChange(id);
	};

	return (
		<ul className="m-0 list-none p-0">
			{!!options &&
				options.map((option, index) => (
					<li key={option.id} className="m-0 flex list-none items-start gap-2.5 rounded-md p-1.5">
						<FormRadioField onChange={handleChangeAnswer.bind(this, option.id)} control={control} name="config.answer" className="mt-1" checked={answer === option.id} value={option.id} />
						<FormTextField control={control} name={`config.options.${index}.value`} label="question_form.answer_option.label" placeholder="question_form.answer_option.placeholder" />
					</li>
				))}
		</ul>
	);
};
