import { create } from "zustand";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
    colorScheme: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    colorScheme: "light",
    isDark: false,
    toggleTheme: () => {
        const nextMode: ThemeMode = get().colorScheme === "light" ? "dark" : "light";
        set({
            colorScheme: nextMode,
            isDark: nextMode === "dark",
        });
    },
    setTheme: (mode: ThemeMode) => {
        set({
            colorScheme: mode,
            isDark: mode === "dark",
        });
    },
}));

// Re-export useTheme alias for convenience
export const useTheme = useThemeStore;

