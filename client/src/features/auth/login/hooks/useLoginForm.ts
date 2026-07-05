import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFormValidationSchema, type ILoginFormValues } from "../model/userLoginForm";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import { api } from "@shared/api";
import { useUser } from "@entities/user";

export const useLoginForm = () => {
	const setUser = useUser((state) => state.setUser);

	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ILoginFormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginFormValidationSchema),
	});

	const submitHandler = handleSubmit(async (data: ILoginFormValues) => {
		try {
			const response = await api.authLoginPost({ email: data.email, password: data.password });

			localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

			setUser(response.data.user);

			navigate("/");
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.response?.status && err.response.status < 500) {
				setError("root", { message: "auth.form.server_errors.login_credentials_invalid" });
			} else {
				setError("root", { message: "auth.form.server_errors.something_wrong" });
			}
		}
	});

	return { isSubmitting, submitHandler, control, errors };
};
