import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
    colorScheme: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
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
        }),
        {
            name: "app-theme-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Re-export useTheme alias for convenience
export const useTheme = useThemeStore;


