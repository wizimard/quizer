import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useGetUser } from "@entities/user";

export interface IPublicRouteGuardProps {
	children: ReactNode;
}

export const PublicRouteGuard = ({ children }: IPublicRouteGuardProps) => {
	const { user, isLoading } = useGetUser();
	const isAuthed = !!user;

	if (!isLoading && isAuthed) {
		return <Navigate to="/" />;
	}

	return (
		<>
			{children}
			{isLoading && <div>Loading...</div>}
		</>
	);
};
