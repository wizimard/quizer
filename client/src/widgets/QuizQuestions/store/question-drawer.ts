import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { QuestionResponse } from "@shared/api/generated";

export interface IQuestionDrawerState {
	isOpen: boolean;
	question?: QuestionResponse;

	setIsOpen: (isOpen: boolean) => void;
	setQuestion: (question: QuestionResponse) => void;
	reset: () => void;
}

export const useQuestionDrawer = create<IQuestionDrawerState>()(
	immer((set) => ({
		isOpen: false,
		question: undefined,
		setIsOpen: (isOpen: boolean) =>
			set((state: IQuestionDrawerState) => {
				state.isOpen = isOpen;
			}),
		setQuestion: (question: QuestionResponse) =>
			set((state: IQuestionDrawerState) => {
				state.question = question;
			}),
		reset: () =>
			set((state: IQuestionDrawerState) => {
				state.isOpen = false;
				state.question = undefined;
			}),
	})),
);
