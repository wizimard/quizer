import { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@shared/ui/loading";
import { ErrorCard } from "@shared/ui/error";

export interface ILoadingLayoutProps {
	isLoading: boolean;
	error?: Error | null;
	children: React.ReactNode;
}

export const LoadingLayout = ({ isLoading, children, error }: ILoadingLayoutProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (error instanceof AxiosError) {
			if (error.status === 404) {
				navigate("/404");
				return;
			}
			if (error.status === 401) {
				navigate("/login");
			}
		}
	}, [navigate, error]);

	return <>{isLoading ? <Loading /> : <>{error ? <ErrorCard message={error.message} /> : <>{children}</>}</>}</>;
};
