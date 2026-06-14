import type { QuestionConfigInput } from "@shared/api/generated";
import { Text } from "@shared/ui/text";

export const QuestionViewInput = ({ answer, ignore_case }: QuestionConfigInput) => {
	return (
		<>
			<Text>
				Ответ: {answer} ({ignore_case ? "без учета регистра" : "с учетом регистра"})
			</Text>
		</>
	);
};
