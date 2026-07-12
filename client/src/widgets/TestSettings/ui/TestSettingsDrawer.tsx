import { useTranslation } from "react-i18next";
import { DefaultButton } from "@shared/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/kit/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/kit/tabs";
import { DeleteTestDialog } from "@features/test/delete-test";
import { TestGeneralSettingsForm } from "@features/test/general-settings-test";
import { TestScheduleForm } from "@features/test/scheduler-test";
import { DIALOG_KEYS, DRAWER_KEYS, useGetDataDrawer, useIsOpenDrawer, useOpenDialog, useSetOpenDrawer } from "@shared/model";
import type { TestFull } from "@entities/test";
import { Typography } from "@shared/ui/typography";

// TODO: review
export const TestSettingsDrawer = () => {
	const { t } = useTranslation();

	const open = useIsOpenDrawer(DRAWER_KEYS.TEST_SETTINGS);
	const setOpen = useSetOpenDrawer(DRAWER_KEYS.TEST_SETTINGS);
	const test = useGetDataDrawer<TestFull>(DRAWER_KEYS.TEST_SETTINGS);

	const openDialog = useOpenDialog(DIALOG_KEYS.DELETE_TEST);

	if (!test) {
		return null;
	}

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="right" className="scrollbar-styled w-[350px] gap-1 overflow-y-auto p-0 sm:max-w-[350px]">
					<SheetHeader className="px-5">
						<SheetTitle className="text-xl font-semibold tracking-tight">Настройки</SheetTitle>
					</SheetHeader>

					<Tabs defaultValue="general" className="gap-4 p-1">
						<TabsList className="grid h-auto w-full grid-cols-4">
							<TabsTrigger value="general" className="text-xs">
								Общие
							</TabsTrigger>
							<TabsTrigger value="scheduler" className="text-xs">
								Планировщик
							</TabsTrigger>
							<TabsTrigger value="link" className="text-xs">
								Ссылка
							</TabsTrigger>
							<TabsTrigger value="delete" className="text-xs">
								Удалить
							</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="px-5">
							<TestGeneralSettingsForm test={test} />
						</TabsContent>

						<TabsContent value="scheduler" className="px-5">
							<TestScheduleForm test={test} />
						</TabsContent>

						<TabsContent value="link" className="px-5" />

						<TabsContent value="delete" className="px-5">
							<Typography>{t("test_delete.description")}</Typography>
							<DefaultButton variant="destructive" onClick={openDialog} className="mt-5 w-full">
								{t("test_delete.button")}
							</DefaultButton>
						</TabsContent>
					</Tabs>
				</SheetContent>
			</Sheet>
			<DeleteTestDialog testId={test.id} />
		</>
	);
};
