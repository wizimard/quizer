import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerFormValidationSchema, type IRegisterFormValues } from "../model/userRegisterForm";
import { ACCESS_TOKEN_KEY } from "@shared/constant";
import { useUser } from "@entities/user";
import { authApi } from "@shared/api";

export const useRegisterForm = () => {
	const setUser = useUser((state) => state.setUser);

	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<IRegisterFormValues>({
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
		resolver: zodResolver(registerFormValidationSchema),
	});

	const submitHandler = handleSubmit(async (data: IRegisterFormValues) => {
		try {
			const response = await authApi.authRegisterPost({ email: data.email, password: data.password });

			localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

			setUser(response.data.user);

			navigate("/");
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.response?.status && err.response.status < 500) {
				setError("form", { message: "auth.form.server_errors.email_busy" });
			} else {
				setError("form", { message: "auth.form.server_errors.something_wrong" });
			}
		}
	});

	return { isSubmitting, submitHandler, errors, control };
};
