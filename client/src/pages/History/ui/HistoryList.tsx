import { HistoryListEmpty } from "./HistoryListEmpty";
import { HistoryListItem } from "./HistoryListItem";
import type { TestLaunchHistory } from "@entities/test";

interface HistoryListProps {
	launches: Array<TestLaunchHistory>;
}

export const HistoryList = ({ launches }: HistoryListProps) => {
	if (launches.length === 0) {
		return <HistoryListEmpty />;
	}

	return (
		<ul className="flex flex-col gap-2">
			{launches.map((launch) => (
				<HistoryListItem key={launch.sessionId} launch={launch} />
			))}
		</ul>
	);
};
