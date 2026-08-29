import {useQuery} from "@tanstack/react-query";

import {getOneAd} from "@/api/ads.api";

export function useOneAd(id: number) {
    return useQuery({
        queryKey: ["ad", id],

        queryFn: () => getOneAd(id),

        enabled: !!id,
    });
}
