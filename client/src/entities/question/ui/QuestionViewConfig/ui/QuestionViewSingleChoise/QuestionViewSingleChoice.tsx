import { QuestionOption } from "@entities/question";
import type { QuestionConfigSingleChoice } from "@shared/api/generated";

export const QuestionViewSingleChoice = ({ answer, options }: QuestionConfigSingleChoice) => {
	return (
		<ul className="m-0 flex w-full list-none flex-col gap-2.5 p-0">
			{options.map((option, index) => (
				<li key={option.id} className="m-0 w-full list-none p-0">
					<QuestionOption {...option} value={`${index + 1}. ${option.value}`} disabled={true} checked={option.id === answer} />
				</li>
			))}
		</ul>
	);
};
