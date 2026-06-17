import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Text } from "@shared/ui/text";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const menuItems = [{ id: "logout", title: "header.user_menu.logout" }];

export const HeaderUserMenu = () => {
	const { t } = useTranslation();

	const [el, setEl] = useState<HTMLElement | null>(null);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setEl(event.currentTarget);
	};

	const handleClose = () => {
		setEl(null);
	};

	const handleClickMenuItem = (ev) => {
		console.log(ev);
	};

	return (
		<Box sx={{ marginLeft: "auto" }}>
			<Tooltip title="open menu">
				<IconButton onClick={handleOpen} sx={{ p: 0 }}>
					<Avatar />
				</IconButton>
			</Tooltip>
			<Menu
				id="user-menu"
				anchorEl={el}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				keepMounted
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				open={Boolean(el)}
				onClose={handleClose}
				sx={{ mt: "45px" }}
			>
				{menuItems.map((menuItem) => (
					<MenuItem key={menuItem.id} onClick={handleClickMenuItem}>
						<Text>{t(menuItem.title)}</Text>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};
