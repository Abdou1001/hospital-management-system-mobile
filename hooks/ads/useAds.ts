import {useQuery} from "@tanstack/react-query";

import {getAds} from "@/api/ads.api";
import {AdsFilters, ADS_FILTERS} from "@/types/filter";

export function useAds(filters: AdsFilters = ADS_FILTERS) {
    return useQuery({
        queryKey: ["ads", filters],
        queryFn: () => getAds(filters),
    });
}

