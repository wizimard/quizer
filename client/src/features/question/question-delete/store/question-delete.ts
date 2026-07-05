import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { QuestionResponse } from "@shared/api/generated";

export interface IQuestionDeleteState {
	isOpen: boolean;
	question: QuestionResponse | null;
	setIsOpen: (isOpen: boolean) => void;
	setQuestion: (question: QuestionResponse) => void;
	clear(): void;
}

export const useQuestionDelete = create<IQuestionDeleteState>()(
	immer((set) => ({
		isOpen: false,
		question: null,

		setIsOpen: (isOpen: boolean) => set({ isOpen }),

		setQuestion: (question: QuestionResponse) => set({ question }),

		clear() {
			set({ isOpen: false, question: null });
		},
	})),
);
