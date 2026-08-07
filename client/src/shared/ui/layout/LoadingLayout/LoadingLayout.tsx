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
		switch (error.status) {
			case 404:
				navigate("/404");
				return;
			case 401:
				navigate("/login");
				return;
			case 403:
				errorMessage = "errors.forbidden";
				break;
			default:
				errorMessage = "errors.unknown_error";
				break;
		}
	}

	return <>{isLoading ? <Loading /> : <>{errorMessage ? <ErrorCard message={t(errorMessage)} /> : <>{children}</>}</>}</>;
};
