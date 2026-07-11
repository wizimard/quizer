import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { RegisterForm } from "@features/auth/register";
import { CenterElement } from "@shared/ui/layout";
import { Text } from "@shared/ui/text";

function RegisterPage() {
	const { t } = useTranslation();

	return (
		<CenterElement>
			<RegisterForm />
			<Text className="flex items-center gap-1">
				{t("auth.register.bottom.text")}
				<NavLink to="/login" className="text-blue-500 capitalize">
					{t("auth.register.bottom.button")}
				</NavLink>
			</Text>
		</CenterElement>
	);
}

export default RegisterPage;
