import ReceptionTabBar from "@/components/reception/ReceptionTabBar";
import { usePendingAppointments } from "@/hooks/appointments/usePendingAppointments";
import { useAuth } from "@/hooks/auth/useAuth";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ReceptionLayout() {
    const router = useRouter();
    const { role, isLoading } = useAuth();
    const { count: pendingCount } = usePendingAppointments();

    // Route Protection: Prevent regular users from accessing reception routes
    useEffect(() => {
        if (!isLoading) {
            const hasAccess = role === "reception" || role === "admin";
            if (!hasAccess) {
                router.replace("/(tabs)");
            }
        }
    }, [role, isLoading]);

    if (isLoading) {
        return null;
    }

    const hasAccess = role === "reception" || role === "admin";
    if (!hasAccess) {
        return null;
    }

    return (
        <Tabs
            tabBar={(props) => (
                <ReceptionTabBar {...props} pendingCount={pendingCount} />
            )}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="pending"
                options={{
                    title: "الحجوزات المعلقة",
                }}
            />
            <Tabs.Screen
                name="all"
                options={{
                    title: "جميع الحجوزات",
                }}
            />
        </Tabs>
    );
}
