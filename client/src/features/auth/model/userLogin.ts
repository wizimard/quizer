import { useUser } from "@entities/user";
import { api } from "@shared/api";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export interface ILoginFormValues {
	email: string;
	password: string;
}

export const loginFormValidationSchema = yup.object<ILoginFormValues>({
	email: yup.string().email().required(),
	password: yup.string().min(8).max(255).required(),
});

export const useLoginForm = () => {
	const setUser = useUser((state) => state.setUser);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const onSubmit = async (data: ILoginFormValues) => {
		setIsLoading(true);

		try {
			const response = await api.authLoginPost({ email: data.email, password: data.password });

			localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

			setUser(response.data.user);

			navigate("/");
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.status < 500) {
				setError("Login or password is wrong");
			} else {
				setError("Something went wrong");
			}
		}

		setIsLoading(false);
	};

	return { isLoading, onSubmit, error };
};
