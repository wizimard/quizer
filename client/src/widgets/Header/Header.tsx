import { Toolbar } from "@mui/material";
import { Text } from "@shared/ui/text";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { Link } from "react-router-dom";

export const Header = () => {
	return (
		<Toolbar disableGutters sx={{ p: "5px 20px", borderBottom: "2px solid green", flexShrink: 0 }}>
			<Link to="/">
				<Text variant="body1">Logo</Text>
			</Link>
			<HeaderUserMenu />
		</Toolbar>
	);
};
