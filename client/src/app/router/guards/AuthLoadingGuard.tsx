import { useGetUser } from "@entities/user";
import type { ReactNode } from "react";

export interface IAuthLoadingGuardProps {
	children: ReactNode;
}

export const AuthLoadingGuard = ({ children }: IAuthLoadingGuardProps) => {
	const { isLoading } = useGetUser();

	if (isLoading) {
		return null;
	}

	return children;
};
