import { Spinner } from "@shared/ui/kit/spinner";
import { cn } from "@shared/lib/utils";

export const Loading = ({ className, ...props }: React.ComponentProps<typeof Spinner>) => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Spinner aria-label="Loading…" className={cn("size-8", className)} {...props} />
		</div>
	);
};
