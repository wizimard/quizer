import { FormTextField } from "@shared/ui/form";
import type { TQuiz } from "@entities/quiz";
import { useNavigate } from "react-router";
import { QuizEditFormActions } from "./ui/QuizEditFormActions";
import { QuizQuestionsSection } from "./ui/QuizQuestionsSection";
import { useEditQuizForm } from "../../hooks/useEditQuizForm";
import type { EditQuizFormModes } from "../../model/editQuizFormModes";

export interface IQuizEditFormProps {
	quiz: TQuiz;
	mode: EditQuizFormModes;
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
