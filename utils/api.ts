const API_BASE_URL = "https://dailydose-backend-lao8.onrender.com/api";

export interface Quote {
    id: number;
    quote: string;
    author: string;
    category_id?: number;
    type?: string;
    date?: string;
}

export async function getDailyQuotes(): Promise<Quote[]> {
    const res = await fetch(`${API_BASE_URL}/quotes/daily`);
    if (!res.ok) throw new Error("Failed to fetch daily quotes.");
    return res.json();
}