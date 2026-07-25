import { useTranslation } from "react-i18next";
import { Typography } from "@shared/ui/typography";

export type UsersTableEmptyVariant = "execution" | "session";

interface UsersTableEmptyProps {
	variant?: UsersTableEmptyVariant;
}

const EMPTY_COPY_KEYS: Record<UsersTableEmptyVariant, { title: string; description: string }> = {
	execution: {
		title: "test_manage.table.empty_title",
		description: "test_manage.table.empty_description",
	},
	session: {
		title: "test_session_overview.table.empty_title",
		description: "test_session_overview.table.empty_description",
	},
};

export const UsersTableEmpty = ({ variant = "execution" }: UsersTableEmptyProps) => {
	const { t } = useTranslation();
	const emptyCopy = EMPTY_COPY_KEYS[variant];

	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
			<Typography variant="subtitle1" className="text-foreground">
				{t(emptyCopy.title)}
			</Typography>
			<Typography variant="body2" className="mt-1.5 max-w-sm text-muted-foreground">
				{t(emptyCopy.description)}
			</Typography>
		</div>
	);
};
