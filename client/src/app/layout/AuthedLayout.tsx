import { Box } from "@mui/material";
import { Header } from "@widgets/Header";
import type { ReactNode } from "react";

export interface IAuthedLayoutProps {
	children: ReactNode;
}
export const AuthedLayout = ({ children }: IAuthedLayoutProps) => {
	return (
		<Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
			<Header />
			{children}
		</Box>
	);
};
