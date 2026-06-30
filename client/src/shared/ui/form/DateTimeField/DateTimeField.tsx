import { format, isBefore, isValid, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, type Control, type Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/kit/button";
import { Calendar } from "@shared/ui/kit/calendar";
import { Field, FieldError, FieldLabel } from "@shared/ui/kit/field";
import { Input } from "@shared/ui/kit/input";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/kit/popover";

export interface IDateTimeFieldProps {
	label?: string;
	value?: Date | null;
	onChange?: (value: Date | null | undefined) => void;
	id?: string;
	disabled?: boolean;
	allowEmpty?: boolean;
	minDate?: Date;
	className?: string;
	"aria-invalid"?: boolean;
	error?: string;
}

export type TFormDateTimeFieldProps<T> = Omit<IDateTimeFieldProps, "value" | "onChange" | "aria-invalid" | "error"> & {
	name: Path<T>;
	control: Control<T, unknown, T>;
	required?: boolean;
};

const isValidDate = (date?: Date | null): date is Date => date instanceof Date && isValid(date);

const getTimeValue = (date?: Date | null) => (isValidDate(date) ? format(date, "HH:mm") : "");

const sanitizeTimeInput = (raw: string, previous?: string) => {
	const cleaned = raw.replace(/[^\d:]/g, "");
	const isDeleting = previous !== undefined && raw.length < previous.length;

	if (cleaned.includes(":")) {
		const [hoursPart = "", minutesPart = ""] = cleaned.split(":");

		return `${hoursPart.slice(0, 2)}:${minutesPart.slice(0, 2)}`;
	}

	const digits = cleaned.slice(0, 4);

	if (digits.length <= 2) {
		if (digits.length === 2 && !isDeleting) {
			return `${digits}:`;
		}

		return digits;
	}

	return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

const parseValidTime = (time: string): [number, number] | null => {
	const match = time.match(/^(\d{1,2}):(\d{2})$/);

	if (!match) {
		return null;
	}

	const hours = Number(match[1]);
	const minutes = Number(match[2]);

	if (hours > 23 || minutes > 59) {
		return null;
	}

	return [hours, minutes];
};

const mergeDate = (current: Date | undefined, nextDate: Date) => {
	const result = new Date(nextDate);

	if (current) {
		result.setHours(current.getHours(), current.getMinutes(), 0, 0);
	}

	return result;
};

const mergeTime = (current: Date | null | undefined, time: string, allowEmpty?: boolean) => {
	if (!time) {
		if (allowEmpty && !isValidDate(current)) {
			return null;
		}

		return current ?? undefined;
	}

	const parsed = parseValidTime(time);

	if (!parsed) {
		return current ?? undefined;
	}

	const [hours, minutes] = parsed;

	if (!isValidDate(current)) {
		if (allowEmpty) {
			return null;
		}

		const result = new Date();

		result.setHours(hours, minutes, 0, 0);

		return result;
	}

	const result = new Date(current);

	result.setHours(hours, minutes, 0, 0);

	return result;
};

const clampToMinDate = (date: Date, minDate?: Date) => {
	if (!minDate || !isBefore(date, minDate)) {
		return date;
	}

	return new Date(minDate);
};

export const DateTimeField = ({ label, value, onChange, id, disabled, allowEmpty, minDate, className, "aria-invalid": ariaInvalid, error }: IDateTimeFieldProps) => {
	const { t } = useTranslation();
	const [timeInput, setTimeInput] = useState(() => getTimeValue(value));
	const isTimeFocusedRef = useRef(false);

	useEffect(() => {
		if (!isTimeFocusedRef.current) {
			setTimeInput(getTimeValue(value));
		}
	}, [value]);

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) {
			onChange?.(allowEmpty ? null : undefined);
			return;
		}

		onChange?.(clampToMinDate(mergeDate(isValidDate(value) ? value : undefined, date), minDate));
	};

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextTime = sanitizeTimeInput(event.target.value, timeInput);

		setTimeInput(nextTime);

		if (!nextTime) {
			onChange?.(mergeTime(value, "", allowEmpty));
			return;
		}

		const merged = mergeTime(value, nextTime, allowEmpty);

		if (merged && isValidDate(merged)) {
			onChange?.(clampToMinDate(merged, minDate));
		} else if (merged !== undefined) {
			onChange?.(merged);
		}
	};

	const handleTimeFocus = () => {
		isTimeFocusedRef.current = true;
	};

	const handleTimeBlur = () => {
		isTimeFocusedRef.current = false;

		if (!timeInput || parseValidTime(timeInput)) {
			return;
		}

		setTimeInput(getTimeValue(value));
	};

	const handleClear = () => {
		setTimeInput("");
		onChange?.(null);
	};

	return (
		<Field className={cn("w-full", className)} data-invalid={ariaInvalid}>
			{label && <FieldLabel htmlFor={id}>{t(label)}</FieldLabel>}
			<div className="flex flex-nowrap items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id={id}
							type="button"
							variant="outline"
							disabled={disabled}
							aria-invalid={ariaInvalid}
							className={cn("min-w-[10rem] justify-start font-normal", !isValidDate(value) && "text-muted-foreground")}
						>
							<CalendarIcon />
							{isValidDate(value) ? format(value, "dd MM yyyy", { locale: ru }) : t("common.datetime.pick_date")}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							required={!allowEmpty}
							selected={isValidDate(value) ? value : undefined}
							onSelect={handleDateSelect}
							locale={ru}
							disabled={disabled ? true : minDate ? { before: startOfDay(minDate) } : undefined}
						/>
						{allowEmpty && isValidDate(value) && (
							<div className="border-t p-2">
								<Button type="button" variant="ghost" size="sm" className="w-full" disabled={disabled} onClick={handleClear}>
									{t("common.datetime.clear_date")}
								</Button>
							</div>
						)}
					</PopoverContent>
				</Popover>
				<span className="text-sm text-muted-foreground">{t("common.datetime.at")}</span>
				<Input
					type="text"
					inputMode="numeric"
					placeholder="00:00"
					value={timeInput}
					onChange={handleTimeChange}
					onFocus={handleTimeFocus}
					onBlur={handleTimeBlur}
					disabled={disabled || (allowEmpty && !isValidDate(value))}
					aria-invalid={ariaInvalid}
					className="w-auto bg-background"
				/>
				{/* {allowEmpty && isValidDate(value) && (
					<Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label={t("common.datetime.clear_date")} onClick={handleClear}>
						<XIcon />
					</Button>
				)} */}
			</div>
			{error && <FieldError>{t(error)}</FieldError>}
		</Field>
	);
};

export const FormDateTimeField = <T extends object>({ control, name, required, className, label, id, ...props }: TFormDateTimeFieldProps<T>) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required }}
			render={({ field, fieldState }) => (
				<DateTimeField
					{...props}
					id={id ?? name}
					label={label}
					className={className}
					value={field.value}
					onChange={field.onChange}
					aria-invalid={fieldState.invalid}
					error={fieldState.invalid ? fieldState.error?.message : undefined}
				/>
			)}
		/>
	);
};
