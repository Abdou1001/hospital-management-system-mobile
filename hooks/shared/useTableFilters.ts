import {useMemo} from "react";
import {usePathname, useRouter, useLocalSearchParams} from "expo-router";

export function useTableFilters<T extends Record<string, any>>(
    defaultFilters: T,
) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useLocalSearchParams();

    const filters = useMemo(() => {
        const values = {} as T;

        Object.entries(defaultFilters).forEach(([key, defaultValue]) => {
            const rawValue = searchParams[key];
            const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

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
        router.setParams(values as Record<string, string>);
    };

    return {
        filters,
        setFilters,
    };
}
