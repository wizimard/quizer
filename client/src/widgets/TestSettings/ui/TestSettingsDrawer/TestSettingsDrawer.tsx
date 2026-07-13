import { useTranslation } from "react-i18next";
import { TestDeleteTab } from "./ui/TestDeleteTab";
import { TestLinkTab } from "./ui/TestLinkTab";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/kit/tabs";
import { DeleteTestDialog } from "@features/test/delete-test";
import { TestGeneralSettingsForm } from "@features/test/general-settings-test";
import { TestScheduleForm } from "@features/test/scheduler-test";
import { DRAWER_KEYS, useGetDataDrawer, useIsOpenDrawer, useSetOpenDrawer } from "@shared/model";
import type { TestFull } from "@entities/test";

// TODO: review
export const TestSettingsDrawer = () => {
	const { t } = useTranslation();

	const open = useIsOpenDrawer(DRAWER_KEYS.TEST_SETTINGS);
	const setOpen = useSetOpenDrawer(DRAWER_KEYS.TEST_SETTINGS);
	const test = useGetDataDrawer<TestFull>(DRAWER_KEYS.TEST_SETTINGS);

	if (!test) {
		return null;
	}

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="right" className="scrollbar-styled w-[350px] gap-1 overflow-y-auto p-0 sm:max-w-[350px]">
					<SheetHeader className="px-5">
						<SheetTitle className="text-xl font-semibold tracking-tight">{t("test_settings_drawer.title")}</SheetTitle>
					</SheetHeader>

					<Tabs defaultValue="general" className="gap-4 p-1">
						<TabsList className="grid h-auto w-full grid-cols-4">
							<TabsTrigger value="general" className="text-xs">
								{t("test_settings_drawer.tabs.general")}
							</TabsTrigger>
							<TabsTrigger value="scheduler" className="text-xs">
								{t("test_settings_drawer.tabs.scheduler")}
							</TabsTrigger>
							<TabsTrigger value="link" className="text-xs">
								{t("test_settings_drawer.tabs.link")}
							</TabsTrigger>
							<TabsTrigger value="delete" className="text-xs">
								{t("test_settings_drawer.tabs.delete")}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="px-5">
							<TestGeneralSettingsForm test={test} />
						</TabsContent>

						<TabsContent value="scheduler" className="px-5">
							<TestScheduleForm test={test} />
						</TabsContent>

						<TabsContent value="link" className="px-5">
							<TestLinkTab testId={test.id} />
						</TabsContent>

						<TabsContent value="delete" className="px-5">
							<TestDeleteTab />
						</TabsContent>
					</Tabs>
				</SheetContent>
			</Sheet>
			<DeleteTestDialog testId={test.id} />
		</>
	);
};
