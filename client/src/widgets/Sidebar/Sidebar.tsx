import { Logo } from "./Logo";
import { SidebarLogout } from "./SidebarLogout";
import { SidebarNav } from "./SidebarNav";

export const Sidebar = () => {
	return (
		<aside className="flex h-full w-56 shrink-0 flex-col border-r-2 border-green-600 py-4">
			<div className="mb-6 border-b-2 border-green-600 px-3 pb-4">
				<Logo />
			</div>
			<div className="flex min-h-0 flex-1 flex-col px-3">
				<SidebarNav />
				<div className="mt-auto">
					<SidebarLogout />
				</div>
			</div>
		</aside>
	);
};
