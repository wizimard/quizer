import zod from "zod";
import { TestStartRequestBodyRunModeEnum } from "@shared/api/generated";
import type { ISelectOption } from "@shared/ui/form/FormSelectField";

export const startTestForm = zod.object({
	runMode: zod.enum([TestStartRequestBodyRunModeEnum.Free, TestStartRequestBodyRunModeEnum.Manual]),
	durationMinutes: zod.string(),
});

export type StartTestForm = zod.infer<typeof startTestForm>;

export const RUN_MODE_OPTIONS: ISelectOption[] = [
	{ value: TestStartRequestBodyRunModeEnum.Free, text: "test_start.dialog.run_mode.options.free" },
	{ value: TestStartRequestBodyRunModeEnum.Manual, text: "test_start.dialog.run_mode.options.manual" },
];

export const DURATION_PRESETS = [
	{ minutes: 30, labelKey: "test_start.dialog.presets.m30" },
	{ minutes: 60, labelKey: "test_start.dialog.presets.h1" },
	{ minutes: 120, labelKey: "test_start.dialog.presets.h2" },
] as const;

export const toStartTestRequest = (data: StartTestForm) => {
	if (data.runMode !== TestStartRequestBodyRunModeEnum.Free) {
		return {
			runMode: data.runMode,
		};
	}

	const parsedMinutes = data.durationMinutes.trim() === "" ? undefined : Number(data.durationMinutes);
	const duration = parsedMinutes && Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? Math.round(parsedMinutes * 60) : undefined;

	return {
		runMode: data.runMode,
		duration,
	};
};
