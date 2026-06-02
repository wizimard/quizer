import type { UserAuthResponseUser } from "@shared/api/generated";
import { create } from "zustand";

export interface IUserState {
	user: UserAuthResponseUser | null;
	setUser(user: UserAuthResponseUser): void;
	clearUser(): void;
}

export const useUser = create<IUserState>((set) => ({
	user: null,
	setUser: (user: UserAuthResponseUser) => set((state) => ({ ...state, user })),
	clearUser: () => set((state) => ({ ...state, user: null })),
}));
