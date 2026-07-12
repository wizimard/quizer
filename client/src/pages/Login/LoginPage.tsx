import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Typography } from "@shared/ui/typography";
import { CenterElement } from "@shared/ui/layout";
import { LoginForm } from "@features/auth/login";

function LoginPage() {
	const { t } = useTranslation();

	return (
		<CenterElement>
			<LoginForm />
			<Typography className="flex items-center gap-1">
				{t("auth.login.bottom.text")}
				<NavLink to="/register" className="text-blue-500 capitalize">
					{t("auth.login.bottom.button")}
				</NavLink>
			</Typography>
		</CenterElement>
	);
}

export default LoginPage;
