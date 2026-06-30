import { FormSelectField, FormTextField, type TFormSelectFieldChangeEvent } from "@shared/ui/form";
import { type Control, type UseFieldArrayRemove, useWatch, useController } from "react-hook-form";
import { Text } from "@shared/ui/text";
import { QuestionEditConfig } from "./ui/QuestionEditConfig";
import { QuestionEditHeader } from "./ui/QuestionEditHeader";
import { QUESTION_TYPES_OPTIONS } from "./question-type-options";
import type { IEditQuiz } from "@features/quiz/quiz-edit/model/editQuizForm";
import { QuestionListItemContainer } from "@entities/question";
import { memo } from "react";

export interface IQuestionEditProps {
	control: Control<IEditQuiz, unknown, IEditQuiz>;
	index: number;
	isLast: boolean;
	removeQuestion: UseFieldArrayRemove;
	changeQuestionType: (index: number, type: string) => void;
	changeQuestionOrder(from: number, to: number): void;
}

export type TSelectChangeEvent =
	| React.ChangeEvent<HTMLInputElement, Element>
	| (Event & {
			target: {
				value: unknown;
				name: string;
			};
	  });

export const QuestionEdit = ({ control, index, isLast, removeQuestion, changeQuestionType, changeQuestionOrder }: IQuestionEditProps) => {
	const config = useWatch({ name: `questions.${index}.config`, control });

	const {
		fieldState: { error },
	} = useController({ control, name: `questions.${index}` });

	const handleChange = (ev: TFormSelectFieldChangeEvent) => {
		const type: string = ev.target.value as string;

		changeQuestionType(index, type);
	};
	return (
		<li className="m-0 flex list-none gap-1.5 p-0">
			<Text component="span" className="pt-0.5">
				{index + 1}
			</Text>
			<QuestionListItemContainer isError={!!error}>
				<QuestionEditHeader index={index} isLast={isLast} removeQuestion={removeQuestion} changeQuestionOrder={changeQuestionOrder} />
				<FormTextField
					control={control}
					name={`questions.${index}.description`}
					placeholder="question_create_form.description.placeholder"
					label="question_create_form.description.label"
					className="mb-5"
				/>
				<FormSelectField
					onChange={handleChange}
					control={control}
					name={`questions.${index}.config.type`}
					id={`questions.${index}.type`}
					options={QUESTION_TYPES_OPTIONS}
					label="question_create_form.type.label"
					placeholder="question_create_form.type.placeholder"
				/>
				{config && <QuestionEditConfig type={config.type} config={config} control={control} name={`questions.${index}.config`} />}
			</QuestionListItemContainer>
		</li>
	);
};

export const QuestionEditMemo = memo(QuestionEdit);
