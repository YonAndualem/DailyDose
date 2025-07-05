const API_BASE_URL = "https://daily-dose-backend-yonas-berhanu-andualems-projects.vercel.app/api";

export interface Quote {
    id: number;
    uuid: string; // Now required!
    quote: string;
    author: string;
    category?: string;
    type?: string;
    date?: string;
}

// Quote of the Day
export async function getQuoteOfTheDay(): Promise<Quote> {
    const res = await fetch(`${API_BASE_URL}/quotes/random/of-the-day`);
    if (!res.ok) throw new Error("Failed to fetch the quote of the day.");
    return res.json();
}

// Get all quote UUIDs
export async function getAllQuoteUuids(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/quotes`);
    if (!res.ok) throw new Error("Failed to fetch quotes.");
    const quotes = await res.json();
    return quotes.map((q: Quote) => q.uuid);
}

// Get specific quote by UUID
export async function getQuoteByUuid(uuid: string): Promise<Quote> {
    const res = await fetch(`${API_BASE_URL}/quotes/uuid/${uuid}`);
    if (!res.ok) throw new Error("Failed to fetch quote by UUID.");
    return res.json();
}

// Get all categories
export async function getAllCategories(): Promise<{ id: number; name: string }[]> {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories.");
    return res.json();
}

// Get quote UUIDs by category
export async function getQuoteUuidsByCategory(category: string): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/quotes?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Failed to fetch quotes by category.");
    const quotes = await res.json();
    return quotes.map((q: Quote) => q.uuid);
}