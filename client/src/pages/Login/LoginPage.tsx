import { Text } from "@shared/ui/text";
import { CenterElement } from "@shared/ui/layout";
import { NavLink } from "react-router-dom";
import { LoginForm } from "@features/auth";

function LoginPage() {
	return (
		<CenterElement>
			<LoginForm />
			<Text>
				Don't have an account? <NavLink to="/register">register</NavLink>
			</Text>
		</CenterElement>
	);
}

export default LoginPage;
