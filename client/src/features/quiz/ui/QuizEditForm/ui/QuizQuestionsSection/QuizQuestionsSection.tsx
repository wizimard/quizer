import type { IEditQuiz, TQuestionForm } from "@features/quiz/model/editQuizForm";
import { QuestionAdd } from "../QuestionAdd/QuestionAdd";
import { QuestionEdit } from "../QuestionEdit/QuestionEdit";
import { Text } from "@shared/ui/text";
import { useTranslation } from "react-i18next";
import type { Control, FieldArrayWithId, FieldErrors, UseFieldArrayRemove } from "react-hook-form";

export interface IQuizQuestionsSectionProps {
	control: Control<IEditQuiz, unknown, IEditQuiz>;
	fieldsQuestions: FieldArrayWithId<IEditQuiz, "questions", "id">[];
	errors: FieldErrors<IEditQuiz>["questions"];
	removeQuestion: UseFieldArrayRemove;
	changeQuestionType: (index: number, type: string) => void;
	changeQuestionOrder: (from: number, to: number) => void;
	appendQuestion: (question: TQuestionForm) => void;
}

export const QuizQuestionsSection = ({
	control,
	fieldsQuestions,
	errors,
	removeQuestion,
	changeQuestionType,
	changeQuestionOrder,
	appendQuestion,
}: IQuizQuestionsSectionProps) => {
	const { t } = useTranslation();

	return (
		<>
			<Text variant="h5" className="py-2.5">
				{t("quiz.questions")}
			</Text>
			{errors?.root && (
				<Text variant="body1" color="error" align="center" className="mb-2.5">
					{t(errors.root.message)}
				</Text>
			)}
			{errors?.message && (
				<Text variant="body1" color="error" align="center" className="mb-2.5">
					{t(errors.message)}
				</Text>
			)}
			{!!fieldsQuestions.length && (
				<ul className="m-0 flex list-none flex-col gap-5 p-0 pb-5">
					{fieldsQuestions.map((question, index) => (
						<QuestionEdit
							key={question.id}
							control={control}
							index={index}
							isLast={index + 1 === fieldsQuestions.length}
							removeQuestion={removeQuestion}
							changeQuestionType={changeQuestionType}
							changeQuestionOrder={changeQuestionOrder}
						/>
					))}
				</ul>
			)}
			<QuestionAdd appendQuestion={appendQuestion} />
		</>
	);
};
