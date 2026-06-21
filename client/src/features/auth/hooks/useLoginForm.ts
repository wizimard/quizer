import { useUser } from "@entities/user";
import { api } from "@shared/api";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { loginFormValidationSchema, type ILoginFormValues } from "../model/userLoginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
			if (err instanceof AxiosError && err.status < 500) {
				setError("form", { message: "auth.form.server_errors.login_credentials_invalid" });
			} else {
				setError("form", { message: "auth.form.server_errors.something_wrong" });
			}
		}
	});

	return { isSubmitting, submitHandler, control, errors };
};
