import {useQuery} from "@tanstack/react-query";
import api from "@/lib/axios";

const getCurrentUser = async () => {
    const {data} = await api.get("/auth/me");
    return data.user;
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
    });
};
