import type { ReactNode } from "react";
import { Sidebar } from "@widgets/Sidebar";

export interface IAuthedLayoutProps {
	children: ReactNode;
}
export const AuthedLayout = ({ children }: IAuthedLayoutProps) => {
	return (
		<div className="flex h-full w-full">
			<Sidebar />
			<div className="min-w-0 flex-1 overflow-auto">{children}</div>
		</div>
	);
};
