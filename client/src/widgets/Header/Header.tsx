import { Toolbar } from "@mui/material";
import { Text } from "@shared/ui/text";
import { HeaderUserMenu } from "./HeaderUserMenu";

export const Header = () => {
	return (
		<Toolbar disableGutters sx={{ p: "5px 20px", borderBottom: "2px solid green" }}>
			<Text variant="body1">Logo</Text>
			<HeaderUserMenu />
		</Toolbar>
	);
};
