import type { QuestionConfigOption } from "@shared/api/generated";
import { cn } from "@shared/lib/utils";
import { Typography } from "@shared/ui/typography";

export interface QuestionOptionProps extends QuestionConfigOption {
	checked?: boolean;
	disabled?: boolean;
	onClick?: (id: string) => void;
}

export const QuestionOption = ({ id, value, checked, disabled, onClick }: QuestionOptionProps) => {
	const handleClick = () => {
		if (!onClick) {
			return;
		}
		onClick(id);
	};

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={handleClick}
			className={cn("w-full rounded-[10px] border px-2.5 py-1.5 text-start outline-none", checked ? "border-[#177D00] bg-[#C7FFCC]" : "border-[#B8B8B8] bg-transparent")}
		>
			<Typography>{value}</Typography>
		</button>
	);
};
