import { useWatch } from "react-hook-form";
import { InputConfig } from "./InputConfig";
import { SingleChoiseConfig } from "./SingleChoiseConfig";
import { MultipleChoiseConfig } from "./MultipleChoiseConfig";
import { QUESTION_TYPES } from "@entities/question";
import type { TQuestionFormComponentProps } from "@features/question/question-insert/model/question-form";

export const QuestionConfig = ({ control }: TQuestionFormComponentProps<object>) => {
	const config = useWatch({ control, name: "config" });

	const renderConfig = () => {
		switch (config.type) {
			case QUESTION_TYPES.INPUT:
				return <InputConfig {...config} control={control} />;
			case QUESTION_TYPES.SIGNLE_CHOISE:
				return <SingleChoiseConfig {...config} control={control} />;
			case QUESTION_TYPES.MULTIPLE_CHOISE:
				return <MultipleChoiseConfig {...config} control={control} />;
		}
		return null;
	};

	return <div className="py-2.5">{renderConfig()}</div>;
};
