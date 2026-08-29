import {useAuthStore} from "@/store/auth.store";

export const useAuth = () => {
    const {user, isLoading, setUser, setLoading, clearUser} = useAuthStore();

    return {
        user,
        isLoading,

        isAuthenticated: !!user,

        isAdmin: user?.role === "admin",

        role: user?.role,

        setUser,
        setLoading,
        clearUser,

        logout: clearUser,
    };
};
