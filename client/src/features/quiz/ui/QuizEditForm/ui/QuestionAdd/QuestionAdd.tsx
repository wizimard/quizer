import { v4 as uuidV4 } from "uuid";
import { Plus } from "lucide-react";
import type { TQuestionForm } from "@features/quiz/model/editQuizForm";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "@shared/ui/button";

export interface IQuestionAdd {
	appendQuestion: (question: TQuestionForm) => void;
}
export const QuestionAdd = ({ appendQuestion }: IQuestionAdd) => {
	const { t } = useTranslation();

	const handleClick = () => {
		const id: string = "new_" + uuidV4();

		const question: TQuestionForm = {
			id,
			questionId: id,
			description: "",
			config: null,
		};

		appendQuestion(question);
	};

	return (
		<div className="flex w-full items-center justify-center">
			<DefaultButton type="button" onClick={handleClick} className="w-[200px] bg-green-600 py-2.5 hover:bg-green-700">
				<Plus className="size-4" />
				{t("quiz_create.form.add_question")}
			</DefaultButton>
		</div>
	);
};
