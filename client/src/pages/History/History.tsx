import { HistoryHeader } from "./ui/HistoryHeader";
import { HistoryList } from "./ui/HistoryList";
import { useGetHistory } from "@entities/test";
import { LoadingLayout } from "@shared/ui/layout";

export const HistoryPage = () => {
	const { data, isLoading, error } = useGetHistory();

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!data && (
				<div className="flex min-h-a w-full shrink flex-col gap-4 bg-gradient-to-b from-muted/40 via-background to-background px-10 pt-5 pb-8">
					<HistoryHeader launchesCount={data.length} />
					<HistoryList launches={data} />
				</div>
			)}
		</LoadingLayout>
	);
};
