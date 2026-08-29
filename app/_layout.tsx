import "@/global.css";
import {SplashScreen, Stack} from "expo-router";
import React, {useEffect} from "react";
// font
import {
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    useFonts,
} from "@expo-google-fonts/cairo";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import AppContent from "@/store/providers/AppContent";

export default function App() {
    const [fontsLoaded] = useFonts({
        Cairo_400Regular,
        Cairo_500Medium,
        Cairo_600SemiBold,
        Cairo_700Bold,
        Cairo_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const queryClient = new QueryClient();

    

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

