import { useEffect, useState } from "react";
import { formatElapsedTime } from "@shared/lib/formatElapsedTime";

export function useElapsedTime(startedFrom: Date, finishedAt?: Date | null) {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (finishedAt) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, [finishedAt]);

	const endMs = finishedAt?.getTime() ?? now;

	return formatElapsedTime(endMs - startedFrom.getTime());
}
