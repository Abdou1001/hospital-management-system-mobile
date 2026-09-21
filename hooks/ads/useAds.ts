import {useQuery} from "@tanstack/react-query";

import {getAds} from "@/api/ads.api";
import {AdsFilters, ADS_FILTERS} from "@/types/filter";

export function useAds(filters?: Partial<AdsFilters>) {
    const queryFilters: AdsFilters = {
        ...ADS_FILTERS,
        ...filters,
    };

    return useQuery({
        queryKey: ["ads", queryFilters],
        queryFn: () => getAds(queryFilters),
    });
}

