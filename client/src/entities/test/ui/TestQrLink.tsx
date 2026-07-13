import { AppQrCode, type AppQrCodeSize } from "@shared/ui/qr";

export interface TestQrLinkProps {
	testId: string;
	size: AppQrCodeSize;
}

export const TestQrLink = ({ testId, size }: TestQrLinkProps) => {
	return <AppQrCode size={size} value={`${window.location.origin}/test-execute/${testId}`} />;
};
