const API_BASE_URL = "https://dailydose-backend-lao8.onrender.com/api";

export interface Quote {
    id: number;
    uuid?: string;
    quote: string;
    author: string;
    category?: string;
    type?: string;
    date?: string;
}

export async function getQuoteOfTheDay(): Promise<Quote> {
    const res = await fetch(`${API_BASE_URL}/quotes/random/of-the-day`);
    if (!res.ok) throw new Error("Failed to fetch the quote of the day.");
    return res.json();
}