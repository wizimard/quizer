import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthedLayout } from "../../layout/AuthedLayout";
import { useGetUser } from "@entities/user";

export interface IPrivateRouteGuardProps {
	children: ReactNode;
}

export const PrivateRouteGuard = ({ children }: IPrivateRouteGuardProps) => {
	const { user, isLoading } = useGetUser();
	const isAuthed = !!user;

	if (!isLoading && !isAuthed) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<AuthedLayout>{children}</AuthedLayout>
			{isLoading && <div>Loading...</div>}
		</>
	);
};
