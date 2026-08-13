import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogout } from "@features/auth/logout";
import { Button } from "@shared/ui/kit/button";
import { Typography } from "@shared/ui/typography";

export const SidebarLogout = () => {
	const { t } = useTranslation();
	const { logout } = useLogout();

	return (
		<div className="-mx-3 border-t-2 border-green-600 px-3 pt-4">
			<Button
				variant="outline"
				className="h-11 w-full justify-start gap-3 rounded-lg border-2 border-border bg-transparent px-3 text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:border-red-300 focus-visible:bg-red-50 focus-visible:text-red-700"
				onClick={logout}
			>
				<LogOut className="size-5" />
				<Typography component="span" className="font-medium">
					{t("sidebar.logout")}
				</Typography>
			</Button>
		</div>
	);
};
