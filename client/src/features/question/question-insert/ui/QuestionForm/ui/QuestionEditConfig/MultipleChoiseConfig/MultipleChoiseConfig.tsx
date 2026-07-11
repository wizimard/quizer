import { useController, useFieldArray, useWatch } from "react-hook-form";
import { AnswerOption } from "../AnswerOption";
import { FormCheckboxField } from "@shared/ui/form";
import type { QuestionFormComponentProps, TQuestionFormOption } from "@features/question/question-insert/model/question-form";
import { ButtonAddListItem } from "@shared/ui/button";
import { generateOptions } from "@entities/question/model/questionConfigDefaults";

export interface MultipleChoiseConfigProps {
	options: TQuestionFormOption[];
	answer: string[];
}

export const MultipleChoiseConfig = ({ answer, options, control }: QuestionFormComponentProps<MultipleChoiseConfigProps>) => {
	const { field: answerField } = useController({ control, name: "config.answer" });

	const { append, remove } = useFieldArray({ control, name: "config.options" });

	const answerValue: string[] = useWatch({ control, name: "config.answer", defaultValue: answer }) as string[];

	const handleChangeAnswer = (id: string) => {
		const newAnswer: string[] = answerValue.includes(id) ? answerValue.filter((item: string) => item !== id) : [...answerValue, id];

		answerField.onChange(newAnswer);
	};

	const handleAppend = () => {
		const option = generateOptions(1)[0];

		append({ ...option, optionId: option.id });
	};

	const handleRemove = (index: number) => {
		remove(index);
	};

	return (
		<>
			{!!answer && !!options && (
				<>
					<ul className="m-0 list-none p-0">
						{options.map((option, index) => (
							<AnswerOption
								control={control}
								index={index}
								key={option.optionId}
								option={option}
								isChecked={answerValue.includes(option.optionId)}
								onRemove={handleRemove.bind(this, index)}
							>
								<FormCheckboxField onChange={handleChangeAnswer.bind(this, option.optionId)} className="mt-1" checked={answerValue.includes(option.optionId)} />
							</AnswerOption>
						))}
					</ul>
					{options.length < 8 && <ButtonAddListItem onClick={handleAppend} label="question_form.answer_option.add" />}
				</>
			)}
		</>
	);
};
