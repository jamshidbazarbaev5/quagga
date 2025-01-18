import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./api.ts";

// interface ScanResponse {
//     message: string;
//     bonus?: string;
// }

interface BonusHistoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        bonus: string;
        barcode_data: string;
        created_at: string;
    }[];
    total_bonuses: number;
}

export const useScan = () => {
    return useMutation({
        mutationFn: async ({ barcode_data }: { barcode_data: string }) => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                throw new Error("Необходима авторизация. Пожалуйста, войдите снова.");
            }

            const response = await fetch('https://easybonus.uz/api/scan/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ barcode_data })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Произошла ошибка при сканировании");
            }

            return response.json();
        }
    });
}

export const useBonusHistory = () => {
    return useQuery<BonusHistoryResponse>({
        queryKey: ['bonus-history'],
        queryFn: async () => {
            const response = await api.get('/user/bonus');
            return response.data;
        }
    });
}







