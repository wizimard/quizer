import { Box } from "@mui/material";
import { FormSelectField, FormTextField } from "@shared/ui/form";
import { type Control, type UseFieldArrayRemove, useWatch, useController } from "react-hook-form";
import { Text } from "@shared/ui/text";
import type { IEditQuiz } from "@features/quiz/model/editQuizForm";
import { QuestionEditConfig } from "./ui/QuestionEditConfig";
import { QuestionEditHeader } from "./ui/QuestionEditHeader";
import { QUESTION_TYPES_OPTIONS } from "./question-type-options";
import { QuestionListItemContainer } from "@features/question";

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

	const handleChange = (ev: TSelectChangeEvent) => {
		const type: string = ev.target.value as string;

		changeQuestionType(index, type);
	};
	return (
		<Box component="li" sx={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: "5px" }}>
			<Text component="span" sx={{ paddingTop: "3px" }}>
				{index + 1}
			</Text>
			<QuestionListItemContainer isError={!!error}>
				<QuestionEditHeader index={index} isLast={isLast} removeQuestion={removeQuestion} changeQuestionOrder={changeQuestionOrder} />
				<FormTextField control={control} name={`questions.${index}.description`} placeholder="Введите описание задачи" label="Описание задачи" sx={{ marginBottom: "20px" }} />
				<FormSelectField onChange={handleChange} control={control} name={`questions.${index}.config.type`} id={`questions.${index}.type`} options={QUESTION_TYPES_OPTIONS} label="Тип ответа" />
				{config && <QuestionEditConfig type={config.type} config={config} control={control} name={`questions.${index}.config`} />}
			</QuestionListItemContainer>
		</Box>
	);
};
