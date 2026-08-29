import React, { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useThemeStore, ThemeMode } from "@/store/theme.store";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { colorScheme } = useThemeStore();
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(colorScheme);
    }, [colorScheme, setColorScheme]);

    return <>{children}</>;
};

export const useTheme = () => {
    const { colorScheme, isDark, toggleTheme, setTheme } = useThemeStore();
    return { colorScheme, isDark, toggleTheme, setTheme };
};

export { useThemeStore };
export type { ThemeMode };

