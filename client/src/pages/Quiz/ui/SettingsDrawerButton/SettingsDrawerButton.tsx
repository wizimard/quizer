import { useQuizSettings } from "@pages/Quiz/store/settings.store";
import { Button } from "@shared/ui/kit/button";
import { Settings } from "lucide-react";

export const SettingsDrawerButton = () => {
	const setIsOpen = useQuizSettings((state) => state.setIsOpen);

	const handleClick = () => {
		setIsOpen(true);
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleClick} title="Настройки" className="text-muted-foreground hover:text-foreground">
			<Settings className="size-5" />
		</Button>
	);
};
