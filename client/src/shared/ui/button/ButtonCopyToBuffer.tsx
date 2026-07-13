import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ButtonIcon } from "./ButtonIcon";
import { cn } from "@shared/lib/utils";

export interface ButtonCopyToBufferProps {
	value: string;
	text: string;
	className?: string;
}

const COPIED_RESET_MS = 2000;

export const ButtonCopyToBuffer = ({ value, text, className }: ButtonCopyToBufferProps) => {
	const { t } = useTranslation();

	const [isCopied, setIsCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(value);
			setIsCopied(true);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
		} catch {
			setIsCopied(false);
		}
	}, [value]);

	return (
		<div className={cn("flex h-8 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent pl-2.5 pr-1 dark:bg-input/30", className)}>
			<span className="min-w-0 flex-1 truncate text-sm">{text}</span>
			<ButtonIcon type="button" aria-label={isCopied ? t("common.button_copy.copied") : t("common.button_copy.title")} title={t("common.button_copy.title")} onClick={handleCopy}>
				{isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
			</ButtonIcon>
		</div>
	);
};
