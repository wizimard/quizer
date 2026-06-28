import { InputConfig } from "./InputConfig";
import { SingleChoiseConfig } from "./SingleChoiseConfig";
import { MultipleChoiseConfig } from "./MultipleChoiseConfig";
// import { OrderConfig } from "./OrderConfig/OrderConfig";
import type { QuestionRequestConfig } from "@shared/api/generated";
import type { IEditConfigComponentProps } from "@features/quiz/model/editQuizForm";
import { QUESTION_TYPES } from "@entities/question";

export interface IQuestionEditConfig {
	type: string;
	config: QuestionRequestConfig;
}

const QuestionConfigMapper = {
	[QUESTION_TYPES.INPUT]: InputConfig,
	[QUESTION_TYPES.SIGNLE_CHOISE]: SingleChoiseConfig,
	[QUESTION_TYPES.MULTIPLE_CHOISE]: MultipleChoiseConfig,
	// [QUESTION_TYPES.ORDER]: OrderConfig,
};

export const QuestionEditConfig = ({ type, config, control, name }: IEditConfigComponentProps<IQuestionEditConfig>) => {
	const Component = QuestionConfigMapper[type];

	return (
		<>
			{!!QuestionConfigMapper[type] && (
				<div className="py-2.5">
					<Component {...config} control={control} name={name} />
				</div>
			)}
		</>
	);
};
