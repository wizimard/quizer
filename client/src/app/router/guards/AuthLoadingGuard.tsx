import type { ReactNode } from "react";
import { useGetUser } from "@entities/user";

export interface IAuthLoadingGuardProps {
	children: ReactNode;
}

export const AuthLoadingGuard = ({ children }: IAuthLoadingGuardProps) => {
	const { isLoading, error } = useGetUser();

	if (isLoading && !error) {
		return null;
	}

	return children;
};
