import { FormTextField } from "@shared/ui/form";
import { useEditQuizForm } from "@features/quiz/hooks/useEditQuizForm";
import type { useEditQuizFormModes } from "@features/quiz/hooks/useEditQuizForm.types";
import type { QuizResponse } from "@shared/api/generated";
import { useNavigate } from "react-router";
import { QuizEditFormActions } from "./ui/QuizEditFormActions";
import { QuizQuestionsSection } from "./ui/QuizQuestionsSection";

export interface IQuizEditFormProps {
	quiz: QuizResponse;
	mode: useEditQuizFormModes;
}

export const QuizEditForm = ({ quiz, mode }: IQuizEditFormProps) => {
	const navigate = useNavigate();

	const { control, fieldsQuestions, appendQuestion, removeQuestion, changeQuestionType, changeQuestionOrder, submitHandler, isSubmitting, isDirty, errors } = useEditQuizForm(quiz, mode);

	const handleCancelEditForm = () => {
		navigate(quiz.id === "new_quiz" ? "/" : `/quiz/${quiz.id}`);
	};

	return (
		<form onSubmit={submitHandler} className="flex w-full flex-col items-center">
			<QuizEditFormActions isSubmitting={isSubmitting} isDirty={isDirty} onCancel={handleCancelEditForm} />
			<fieldset disabled={isSubmitting} className="m-0 w-[600px] max-w-full border-none p-0">
				<FormTextField control={control} name="title" placeholder="quiz_create.form.fields.title.placeholder" label="quiz_create.form.fields.title.label" />
				<QuizQuestionsSection
					control={control}
					fieldsQuestions={fieldsQuestions}
					errors={errors.questions}
					removeQuestion={removeQuestion}
					changeQuestionType={changeQuestionType}
					changeQuestionOrder={changeQuestionOrder}
					appendQuestion={appendQuestion}
				/>
			</fieldset>
		</form>
	);
};
