import { useQuery } from "@tanstack/react-query";
import { getBankAccounts } from "@/api/bank-accounts.api";

export function useBankAccounts() {
    return useQuery({
        queryKey: ["bank-accounts"],
        queryFn: getBankAccounts,
    });
}
