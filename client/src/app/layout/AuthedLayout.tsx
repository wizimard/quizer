import { Header } from "@widgets/Header";
import type { ReactNode } from "react";

export interface IAuthedLayoutProps {
	children: ReactNode;
}
export const AuthedLayout = ({ children }: IAuthedLayoutProps) => {
	return (
		<>
			<Header />
			{children}
		</>
	);
};
