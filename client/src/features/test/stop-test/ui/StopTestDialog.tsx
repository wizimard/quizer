import { useTranslation } from "react-i18next";
import { Square } from "lucide-react";
import { useEffect } from "react";
import { useStopTest, type StoppableTest } from "../hooks/useStopTest";
import { DefaultButton } from "@shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { DIALOG_KEYS, useManageOpenDialog } from "@shared/model";

export interface StopTestDialogProps {
	test: StoppableTest;
}

export const StopTestDialog = ({ test }: StopTestDialogProps) => {
	const { t } = useTranslation();

	const { stopTest, isLoading } = useStopTest(test);
	const { isOpen, closeDialog } = useManageOpenDialog(DIALOG_KEYS.STOP_TEST);

	useEffect(() => {
		return () => {
			closeDialog();
		};
	}, []);

	return (
		<Dialog open={isOpen} onOpenChange={stopTest}>
			<DialogContent className="gap-5 pb-5 sm:max-w-md">
				<DialogHeader className="gap-1.5 pr-6">
					<div className="flex items-center gap-2.5">
						<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
							<Square className="size-3.5 fill-current" />
						</div>
						<DialogTitle>{t("test_stop.dialog.title")}</DialogTitle>
					</div>
					<DialogDescription>{t("test_stop.dialog.description")}</DialogDescription>
				</DialogHeader>

				<DialogFooter className="m-0 w-full border-0 bg-transparent p-0">
					<DefaultButton type="button" variant="outline" onClick={closeDialog} disabled={isLoading}>
						{t("common.button_cancel")}
					</DefaultButton>
					<DefaultButton type="button" variant="destructive" onClick={stopTest} isLoading={isLoading}>
						{t("test_stop.dialog.button_close")}
					</DefaultButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
