import api from "@/lib/axios";

export interface BankAccount {
    bank_account_id: number;
    name: string;
    account_number: string;
    path_image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface BankAccountsResponse {
    status: string;
    message: string;
    results: BankAccount[];
}

export async function getBankAccounts(): Promise<BankAccountsResponse> {
    const { data } = await api.get("/bank-accounts/");
    return data;
}
