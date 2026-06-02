import { useUser } from "@entities/user";
import { api } from "@shared/api";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export interface IRegisterFormValues {
	email: string;
	password: string;
	repeatPassword: string;
}

export const registerFormValidationSchema = yup.object<IRegisterFormValues>({
	email: yup.string().email().required(),
	password: yup.string().min(8).max(255).required(),
	repeatPassword: yup
		.string()
		.min(8)
		.max(255)
		.required()
		.oneOf([yup.ref("password")], "Passwords must match"),
});

export const useRegisterForm = () => {
	const setUser = useUser((state) => state.setUser);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const onSubmit = async (data: IRegisterFormValues) => {
		setIsLoading(true);

		try {
			const response = await api.authRegisterPost({ email: data.email, password: data.password });

			localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

			setUser(response.data.user);

			navigate("/");
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.status < 500) {
				setError("Email is busy");
			} else {
				setError("Something went wrong");
			}
		}

		setIsLoading(false);
	};

	return { isLoading, error, onSubmit };
};
