import { useTranslation } from "react-i18next";
import { QuestionViewConfig } from "../QuestionViewConfig";
import { Typography } from "@shared/ui/typography";
import { resolveApiAssetUrl } from "@shared/lib/resolveApiAssetUrl";
import type { Question } from "@entities/question";

export const QuestionManageCardContent = ({ description, config, image, score }: Question) => {
	const { t } = useTranslation();
	const imageUrl = resolveApiAssetUrl(image);

	return (
		<>
			<Typography className="pr-5 pb-5">{description}</Typography>
			{imageUrl ? <img src={imageUrl} alt={t("question_form.image.label")} className="mb-5 max-h-56 w-full object-contain" /> : null}
			<QuestionViewConfig config={config} />
			<Typography className="pt-5" variant="caption">
				{t("question_form.score.label")}: {score}
			</Typography>
		</>
	);
};
