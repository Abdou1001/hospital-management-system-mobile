export function formatNumber(value: number) {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1).replace(".0", "")} مليار`;
    }

    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1).replace(".0", "")} مليون`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1).replace(".0", "")} ألف`;
    }

    return value.toString();
}
