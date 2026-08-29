import {create} from "zustand";

export interface User {
    user_id: number;
    full_name: string;
    email: string | null;
    phone_number: string;
    gender: "ذكر" | "أنثى";
    date_of_birth: string | null;
    role: "admin" | "user" | "reception";
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    isLoading: true,

    setUser: (user) =>
        set({
            user,
            isLoading: false,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    clearUser: () =>
        set({
            user: null,
            isLoading: false,
        }),
}));
