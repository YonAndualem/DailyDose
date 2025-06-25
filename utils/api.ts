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

// Quote of the Day
export async function getQuoteOfTheDay(): Promise<Quote> {
    const res = await fetch(`${API_BASE_URL}/quotes/random/of-the-day`);
    if (!res.ok) throw new Error("Failed to fetch the quote of the day.");
    return res.json();
}

// Get all quote IDs
export async function getAllQuoteIds(): Promise<number[]> {
    const res = await fetch(`${API_BASE_URL}/quotes`);
    if (!res.ok) throw new Error("Failed to fetch quotes.");
    const quotes = await res.json();
    return quotes.map((q: Quote) => q.id);
}

// Get specific quote by ID
export async function getQuoteById(id: number): Promise<Quote> {
    const res = await fetch(`${API_BASE_URL}/quotes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch quote by ID.");
    return res.json();
}

// Get all categories
export async function getAllCategories(): Promise<{ id: number; name: string }[]> {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories.");
    return res.json();
}

// Get quote IDs by category
export async function getQuoteIdsByCategory(category: string): Promise<number[]> {
    const res = await fetch(`${API_BASE_URL}/quotes?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Failed to fetch quotes by category.");
    const quotes = await res.json();
    return quotes.map((q: Quote) => q.id);
  }