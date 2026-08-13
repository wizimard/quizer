import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startTestForm, type StartTestForm } from "../model/startTestForm";
import { useStartTest } from "./useStartTest";
import { TestStartRequestBodyRunModeEnum } from "@shared/api/generated";

export const useStartTestForm = (testId: string) => {
	const {
		control,
		formState: {
			errors: { root: formError },
			isLoading,
			isSubmitting,
		},
		handleSubmit,
		setValue,
		watch,
	} = useForm<StartTestForm>({
		resolver: zodResolver(startTestForm),
		defaultValues: {
			runMode: TestStartRequestBodyRunModeEnum.Free,
			durationMinutes: "",
		},
	});

	const { handleStart, isLoading: isStarting } = useStartTest(testId);

	const submitHandler = handleSubmit((data) => {
		handleStart(data);
	});

	return {
		control,
		formError,
		isLoading: isLoading || isSubmitting || isStarting,
		handleSubmit: submitHandler,
		setValue,
		watch,
	};
};
