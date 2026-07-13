import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TestQrLink } from "@entities/test";
import { CenterElement } from "@shared/ui/layout";
import { Typography } from "@shared/ui/typography";

export const TestQrCodePage = () => {
	const { t } = useTranslation();

	const { id } = useParams();

	return (
		<CenterElement className="w-full h-full">
			<TestQrLink testId={id as string} size="large" />
			<Typography variant="h3" className="pt-8 text-center whitespace-break-spaces">
				{t("test_qr_code.description")}
			</Typography>
		</CenterElement>
	);
};
