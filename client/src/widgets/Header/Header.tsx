import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { Logo } from "./Logo";
import { cn } from "@shared/lib/utils";
import { Typography } from "@shared/ui/typography";

export const Header = () => {
	const { t } = useTranslation();

	return (
		<header className="flex shrink-0 items-center gap-6 border-b-2 border-green-600 px-5 py-1.5">
			<Logo />
			<NavLink to="/" className={({ isActive }) => cn("transition-colors hover:text-foreground", isActive ? "text-foreground font-medium" : "text-muted-foreground")}>
				<Typography component="span" className="capitalize">
					{t("header.tests_link")}
				</Typography>
			</NavLink>
			<HeaderUserMenu />
		</header>
	);
};
