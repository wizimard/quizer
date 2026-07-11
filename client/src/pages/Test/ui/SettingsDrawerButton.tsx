import { Settings } from "lucide-react";
import { Button } from "@shared/ui/kit/button";
import { useTestSettingsDrawer } from "@widgets/TestSettings/store/settings-drawer";

export const SettingsDrawerButton = () => {
	const setIsOpen = useTestSettingsDrawer((state) => state.setIsOpen);

	const handleClick = () => {
		setIsOpen(true);
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleClick} title="Настройки" className="text-muted-foreground hover:text-foreground">
			<Settings className="size-5" />
		</Button>
	);
};
