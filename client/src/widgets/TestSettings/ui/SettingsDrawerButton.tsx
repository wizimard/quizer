import { Settings } from "lucide-react";
import { Button } from "@shared/ui/kit/button";
import { DRAWER_KEYS, useOpenDrawer } from "@shared/model";
import type { TestFull } from "@entities/test";

export interface SettingsDrawerButtonProps {
	test: TestFull;
}

export const SettingsDrawerButton = ({ test }: SettingsDrawerButtonProps) => {
	const setOpen = useOpenDrawer(DRAWER_KEYS.TEST_SETTINGS);

	const handleClick = () => {
		setOpen(test);
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleClick} title="Настройки" className="text-muted-foreground hover:text-foreground">
			<Settings className="size-5" />
		</Button>
	);
};
