"use client";

import {useMemo} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export function useTableFilters<T extends Record<string, any>>(
    defaultFilters: T,
) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const filters = useMemo(() => {
        const values = {} as T;

        Object.entries(defaultFilters).forEach(([key, defaultValue]) => {
            const value = searchParams.get(key);

            if (typeof defaultValue === "number") {
                values[key as keyof T] = (
                    value ? Number(value) : defaultValue
                ) as T[keyof T];
            } else {
                values[key as keyof T] = (value ?? defaultValue) as T[keyof T];
            }
        });

        return values;
    }, [searchParams, defaultFilters]);

    const setFilters = (values: Partial<T>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, value]) => {
            if (value === "" || value === undefined || value === null) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.replace(`${pathname}?${params.toString()}`);
    };

    return {
        filters,
        setFilters,
    };
}
