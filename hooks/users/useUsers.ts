import {useQuery} from "@tanstack/react-query";

import { getUsers, GetUsersParams} from "@/api/user.api";

export function useUsers(params: GetUsersParams) {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getUsers(params),
    });
}
