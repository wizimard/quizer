import { QuestionOption } from "@features/question/ui/QuestionOption";
import type { QuestionConfigSingleChoise } from "@shared/api/generated";

export const QuestionViewSingleChoise = ({ answer, options }: QuestionConfigSingleChoise) => {
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
