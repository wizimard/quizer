import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@shared/ui/kit/avatar";
import { Button } from "@shared/ui/kit/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shared/ui/kit/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/kit/tooltip";
import { Text } from "@shared/ui/text";

const menuItems = [{ id: "logout", title: "header.user_menu.logout" }];

export const HeaderUserMenu = () => {
	const { t } = useTranslation();

	const handleClickMenuItem = (ev: Event) => {
		console.log(ev);
	};

	return (
		<div className="ml-auto">
			<DropdownMenu>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full p-0">
								<Avatar>
									<AvatarFallback />
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>open menu</TooltipContent>
				</Tooltip>
				<DropdownMenuContent align="end">
					{menuItems.map((menuItem) => (
						<DropdownMenuItem key={menuItem.id} onSelect={handleClickMenuItem}>
							<Text>{t(menuItem.title)}</Text>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
