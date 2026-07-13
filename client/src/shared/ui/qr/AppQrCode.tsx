import { QRCode } from "react-qr-code";

export type AppQrCodeSize = "small" | "medium" | "large";

const sizeMap: Record<AppQrCodeSize, number> = {
	small: 64,
	medium: 128,
	large: 256,
};

export interface AppQrCodeProps {
	size: AppQrCodeSize;
	value: string;
}

export const AppQrCode = ({ size, value }: AppQrCodeProps) => {
	return (
		<div className={`h-auto m-[0 auto] w-full`} style={{ maxWidth: sizeMap[size] }}>
			<QRCode value={value} size={256} className="h-auto max-w-full w-full" viewBox="0 0 256 256" />
		</div>
	);
};
