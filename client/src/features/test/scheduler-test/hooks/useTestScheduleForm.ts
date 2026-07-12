import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { scheduleFormValidationSchema, type ScheduleForm } from "../model/scheduleForm";
import { useUpdateTestScheduler } from "./useUpdateTestScheduler";
import { type TestFull } from "@entities/test";

export function useTestScheduleForm(test: TestFull) {
	const {
		control,
		handleSubmit,
		formState: {
			isSubmitting,
			isDirty,
			errors: { root: formError },
			dirtyFields,
		},
		reset,
		setError,
		clearErrors,
		setValue,
	} = useForm<ScheduleForm>({
		defaultValues: {
			schedulePeriods: test.schedulerPeriods.map((period) => ({
				...period,
				periodId: period.id,
			})),
		},
		resolver: zodResolver(scheduleFormValidationSchema) as Resolver<ScheduleForm>,
	});

	const { handleUpdate, isLoading } = useUpdateTestScheduler(test, setError);

	const resetForm = useCallback(() => {
		reset({
			schedulePeriods: test.schedulerPeriods.map((period) => ({
				...period,
				periodId: period.id,
				isDeleted: false,
			})),
		});
	}, [reset, test.schedulerPeriods]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const submitHandler = handleSubmit((data: ScheduleForm) => {
		clearErrors("root");

		handleUpdate(data, dirtyFields);
	});

	const handleRemove = (index: number) => {
		setValue(`schedulePeriods.${index}.isDeleted`, true, { shouldDirty: true });
	};

	return { control, submitHandler, isSubmitting: isLoading || isSubmitting, isDirty, resetForm, formError, remove: handleRemove };
}
