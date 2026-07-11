import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Question } from "@entities/question";

export interface IQuestionDrawerState {
	isOpen: boolean;
	question?: Question;

	setIsOpen: (isOpen: boolean) => void;
	setQuestion: (question: Question) => void;
	reset: () => void;
}

// TODO: rewrite to context
export const useQuestionDrawer = create<IQuestionDrawerState>()(
	immer((set) => ({
		isOpen: false,
		question: undefined,
		setIsOpen: (isOpen: boolean) =>
			set((state: IQuestionDrawerState) => {
				state.isOpen = isOpen;
			}),
		setQuestion: (question: Question) =>
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
