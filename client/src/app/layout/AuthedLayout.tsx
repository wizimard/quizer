import { Header } from "@widgets/Header";
import type { ReactNode } from "react";

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
