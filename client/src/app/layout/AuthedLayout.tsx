import type { ReactNode } from "react";
import { Header } from "@widgets/Header";

export interface IAuthedLayoutProps {
	children: ReactNode;
}
export const AuthedLayout = ({ children }: IAuthedLayoutProps) => {
	return (
		<div className="flex h-full w-full flex-col">
			<Header />
			{children}
		</div>
	);
};
