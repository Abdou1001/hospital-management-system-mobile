import "@/global.css";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// font
import { ThemeProvider } from "@/context/ThemeContext";
import { registerForPushNotificationsAsync } from "@/services/notifications/registerForPushNotifications";
import AppContent from "@/store/providers/AppContent";
import {
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    useFonts,
} from "@expo-google-fonts/cairo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



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

