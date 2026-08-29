import {useCurrentUser} from "@/hooks/auth/useCurrentUser";
import {useAuthStore} from "@/store/auth.store";
import {Stack} from "expo-router";
import React, {useEffect} from "react";
import ToastContainer from "@/components/ui/ToastContainer";

const AppContent = () => {
    const {data: user, isLoading, isError} = useCurrentUser();

    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        if (user) {
            setUser(user);
        }

        if (isError) {
            clearUser();
        }

        setLoading(isLoading);
    }, [user, isLoading, isError]);

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
            <ToastContainer />
        </>
    );
};

export default AppContent;
