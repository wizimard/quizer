import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppQrCode } from "@shared/ui/qr";
import { ButtonCopyToBuffer } from "@shared/ui/button";

export interface TestLinkTabProps {
	testId: string;
}

export const TestLinkTab = ({ testId }: TestLinkTabProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center gap-4 pt-5">
			<AppQrCode size="medium" value={`${window.location.origin}/test-execute/${testId}`} />
			<Link to={`${window.location.origin}/test-qr/${testId}`} target="_blank">
				{t("test_qr_code.button_open_on_new_page")}
			</Link>
			<ButtonCopyToBuffer value={`${window.location.origin}/test-execute/${testId}`} text={`${window.location.origin}/test-execute/${testId}`} />
		</div>
	);
};
