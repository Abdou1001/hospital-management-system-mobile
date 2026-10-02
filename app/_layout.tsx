import "react-native-gesture-handler";
import "@/global.css";
import {SplashScreen, Stack} from "expo-router";
import React, {useEffect} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import { registerForPushNotificationsAsync } from "@/services/notifications/registerForPushNotifications";
import {I18nManager} from "react-native";

console.log("RTL:", I18nManager.isRTL);


export const unstable_settings = {
    initialRouteName: "(tabs)",
};

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

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);
    
    if (!fontsLoaded) {
        return null;
    }

    const queryClient = new QueryClient();


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}

