import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loading } from "@shared/ui/loading";
import { ErrorCard } from "@shared/ui/error";

export interface ILoadingLayoutProps {
	isLoading: boolean;
	error?: Error | null;
	children: React.ReactNode;
}

export const LoadingLayout = ({ isLoading, children, error }: ILoadingLayoutProps) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	let errorMessage: string | null = null;

	if (error && error instanceof AxiosError) {
		if (error.response?.data?.message) {
			errorMessage = error.response.data.message;
		}

		if (error.status === 404) {
			navigate("/404");
			return;
		}
		if (error.status === 401) {
			navigate("/login");
		}
	}

	return <>{isLoading ? <Loading /> : <>{errorMessage ? <ErrorCard message={t(errorMessage)} /> : <>{children}</>}</>}</>;
};
