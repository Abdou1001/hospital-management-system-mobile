import api from "@/lib/axios";

import {AdsFilters} from "@/types/filter";

/* -------------------------------------------------------------------------- */
/*                                  Get Ads                                   */
/* -------------------------------------------------------------------------- */

export async function getAds(filters: AdsFilters) {
    const {data} = await api.get("/ads", {
        params: filters,
    });

    return data;
}

/* -------------------------------------------------------------------------- */
/*                                Get One Ad                                  */
/* -------------------------------------------------------------------------- */

export async function getOneAd(id: number) {
    const {data} = await api.get(`/ads/${id}`);

    return data;
}


