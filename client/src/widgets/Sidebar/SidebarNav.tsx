import type { LucideIcon } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { cn } from "@shared/lib/utils";
import { Typography } from "@shared/ui/typography";

const navItems: { to: string; labelKey: string; icon: LucideIcon }[] = [{ to: "/", labelKey: "sidebar.tests_link", icon: ClipboardList }];

export const SidebarNav = () => {
	const { t } = useTranslation();

	return (
		<nav className="flex flex-1 flex-col gap-2">
			{navItems.map((item) => {
				const Icon = item.icon;

				return (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.to === "/"}
						className={({ isActive }) =>
							cn(
								"inline-flex h-11 w-full items-center justify-start gap-3 rounded-lg border-2 px-3 transition-colors outline-none",
								"focus-visible:border-green-500 focus-visible:bg-green-50 focus-visible:text-green-800",
								isActive
									? "border-green-500 bg-green-50 font-medium text-green-800"
									: "border-border bg-transparent text-muted-foreground hover:border-green-300 hover:bg-green-50/70 hover:text-green-700",
							)
						}
					>
						<Icon className="size-5 shrink-0" />
						<Typography component="span" className="capitalize">
							{t(item.labelKey)}
						</Typography>
					</NavLink>
				);
			})}
		</nav>
	);
};
