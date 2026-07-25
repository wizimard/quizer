import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import { useStartTestForm } from "../hooks/useStartTestForm";
import { DURATION_PRESETS, RUN_MODE_OPTIONS } from "../model/startTestForm";
import { TestStartRequestBodyRunModeEnum } from "@shared/api/generated";
import { DefaultButton } from "@shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/kit/dialog";
import { Field, FieldDescription, FieldLabel } from "@shared/ui/kit/field";
import { Input } from "@shared/ui/kit/input";
import { Button } from "@shared/ui/kit/button";
import { FormSelectField } from "@shared/ui/form";
import { cn } from "@shared/lib/utils";
import { DIALOG_KEYS, useManageOpenDialog } from "@shared/model";

export interface StartTestDialogProps {
	testId: string;
}

export const StartTestDialog = ({ testId }: StartTestDialogProps) => {
	const { t } = useTranslation();

	const { isOpen, closeDialog } = useManageOpenDialog(DIALOG_KEYS.START_TEST);

	const { control, handleSubmit, isLoading, setValue, watch } = useStartTestForm(testId);

	const runMode = watch("runMode");
	const durationMinutes = watch("durationMinutes");
	const isFreeMode = runMode === TestStartRequestBodyRunModeEnum.Free;

	const handleDurationChange = (value: string, onChange: (value: string) => void) => {
		if (value === "" || /^\d{0,4}$/.test(value)) {
			onChange(value);
		}
	};

	const handleClickPreset = (minutes: number) => {
		setValue("durationMinutes", String(minutes));
	};

	return (
		<Dialog open={isOpen} onOpenChange={closeDialog}>
			<DialogContent className="gap-5 pb-5 sm:max-w-md">
				<form onSubmit={handleSubmit} className="contents">
					<DialogHeader className="gap-1.5 pr-6">
						<div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600 ring-1 ring-green-600/20 dark:text-green-500 dark:ring-green-500/20">
							<Clock className="size-5" />
						</div>
						<DialogTitle>{t("test_start.dialog.title")}</DialogTitle>
						<DialogDescription>{t("test_start.dialog.description")}</DialogDescription>
					</DialogHeader>

					<div>
						<FormSelectField control={control} name="runMode" id="start-test-run-mode" label="test_start.dialog.run_mode.label" options={RUN_MODE_OPTIONS} />
						<FieldDescription className="mt-1.5">{t("test_start.dialog.run_mode.hint")}</FieldDescription>
					</div>

					{isFreeMode && (
						<>
							<Controller
								name="durationMinutes"
								control={control}
								render={({ field }) => (
									<Field>
										<FieldLabel htmlFor="start-test-duration">{t("test_start.dialog.duration.label")}</FieldLabel>
										<div className="relative">
											<Input
												id="start-test-duration"
												type="text"
												inputMode="numeric"
												placeholder={t("test_start.dialog.duration.placeholder")}
												value={field.value}
												onChange={(event) => handleDurationChange(event.target.value, field.onChange)}
												disabled={isLoading}
												className="pr-14"
											/>
											<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">{t("test_start.dialog.duration.unit")}</span>
										</div>
										<FieldDescription>{t("test_start.dialog.duration.hint")}</FieldDescription>
									</Field>
								)}
							/>

							<div className="flex flex-wrap gap-2">
								{DURATION_PRESETS.map((preset) => {
									const isActive = durationMinutes === String(preset.minutes);

									return (
										<Button
											key={preset.minutes}
											type="button"
											variant="outline"
											size="sm"
											disabled={isLoading}
											onClick={handleClickPreset.bind(undefined, preset.minutes)}
											className={cn(
												"rounded-lg",
												isActive &&
													"border-green-600/40 bg-green-500/10 text-green-700 hover:bg-green-500/15 hover:text-green-700 dark:border-green-500/40 dark:text-green-400 dark:hover:text-green-400",
											)}
										>
											{t(preset.labelKey)}
										</Button>
									);
								})}
							</div>
						</>
					)}

					<DialogFooter className="m-0 w-full border-0 bg-transparent p-0">
						<DefaultButton type="button" variant="outline" onClick={closeDialog} disabled={isLoading}>
							{t("common.button_cancel")}
						</DefaultButton>
						<DefaultButton type="submit" variant="default" isLoading={isLoading} className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500">
							{t("test_start.dialog.button_start")}
						</DefaultButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
