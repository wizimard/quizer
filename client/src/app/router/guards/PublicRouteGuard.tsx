import { useGetUser } from "@entities/user";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export interface IPublicRouteGuardProps {
	children: ReactNode;
}

export const PublicRouteGuard = ({ children }: IPublicRouteGuardProps) => {
	const { user } = useGetUser();
	const isAuthed = !!user;

	if (isAuthed) {
		return <Navigate to="/" />;
	}

	return children;
};
