import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { RegisterForm } from "@features/auth/register";
import { CenterElement } from "@shared/ui/layout";
import { Typography } from "@shared/ui/typography";

function RegisterPage() {
	const { t } = useTranslation();

	return (
		<CenterElement>
			<RegisterForm />
			<Typography className="flex items-center gap-1">
				{t("auth.register.bottom.text")}
				<NavLink to="/login" className="text-blue-500 capitalize">
					{t("auth.register.bottom.button")}
				</NavLink>
			</Typography>
		</CenterElement>
	);
}

export default RegisterPage;
