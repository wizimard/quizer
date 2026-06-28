import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import type { QuestionConfigMultipleChoise } from "@shared/api/generated";
import { FormCheckboxField } from "@shared/ui/form";
import { useController, useFieldArray, useWatch } from "react-hook-form";
import { Plus } from "lucide-react";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import { AnswerOption } from "../AnswerOption";
import { generateOptions } from "@entities/question";
import { Button } from "@shared/ui/kit/button";

export const MultipleChoiseConfig = ({ answer, options, control, name }: IEditConfigComponentProps<QuestionConfigMultipleChoise>) => {
	const { t } = useTranslation();

	const { field: answerField } = useController({ control, name: `${name}.answer` });

	const { append, remove } = useFieldArray({ control, name: `${name}.options` });

	const answerValue: string[] = useWatch({ control, name: `${name}.answer`, defaultValue: answer }) as string[];

	const handleChangeAnswer = (id: string) => {
		const newAnswer: string[] = answerValue.includes(id) ? answerValue.filter((item: string) => item !== id) : [...answerValue, id];

		answerField.onChange(newAnswer);
	};

	const handleAppend = () => {
		append(generateOptions(1));
	};

	return (
		<>
			{!!answer && !!options && (
				<>
					<ul className="m-0 list-none p-0">
						{options.map((option, index) => (
							<AnswerOption control={control} name={name} index={index} key={option.id} option={option} isChecked={answerValue.includes(option.id)} onRemove={remove}>
								<FormCheckboxField onChange={handleChangeAnswer.bind(this, option.id)} className="mt-1" checked={answerValue.includes(option.id)} />
							</AnswerOption>
						))}
					</ul>
					{options.length < 8 && (
						<Button type="button" variant="ghost" className="mt-2.5 flex w-full items-center justify-start gap-6 pl-3.5 text-left" onClick={handleAppend}>
							<Plus />
							<Text>{t("question_create_form.answer_option.add")}</Text>
						</Button>
					)}
				</>
			)}
		</>
	);
};
