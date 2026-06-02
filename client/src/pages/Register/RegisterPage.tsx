import { RegisterForm } from "@features/auth";
import { CenterElement } from "@shared/ui/layout";
import { Text } from "@shared/ui/text";
import { NavLink } from "react-router-dom";

function RegisterPage() {
	return (
		<CenterElement>
			<RegisterForm />
			<Text>
				Already have an account? <NavLink to="/login">login</NavLink>
			</Text>
		</CenterElement>
	);
}

export default RegisterPage;
