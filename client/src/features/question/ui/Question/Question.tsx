import { QUESTION_MODES, type TQuestionProps } from "./Question.types";
import { QuestionExecute } from "./ui/QuestionExecute";
import { QuestionView } from "./ui/QuestionView";

export const Question = ({ mode, question }: TQuestionProps) => {
	return <>{mode === QUESTION_MODES.EXECUTE ? <QuestionExecute {...(question as object)} /> : <QuestionView {...question} />}</>;
};
