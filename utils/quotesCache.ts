import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quote } from "./api";

// Keys
const CACHED_QUOTES_KEY = "cachedQuotes";
const CACHED_QOTD_KEY = "cachedQOTD";

// Save recent quotes (up to 30), deduplicated by uuid
export async function cacheQuotes(quotes: Quote[]) {
    try {
        // Deduplicate by uuid
        const uniqueQuotes = Array.from(
            new Map(quotes.map(q => [q.uuid, q])).values()
        );
        await AsyncStorage.setItem(CACHED_QUOTES_KEY, JSON.stringify(uniqueQuotes.slice(0, 30)));
    } catch (e) { }
}

export async function getCachedQuotes(): Promise<Quote[] | null> {
    try {
        const json = await AsyncStorage.getItem(CACHED_QUOTES_KEY);
        return json ? JSON.parse(json) : null;
    } catch (e) {
        return null;
    }
}

// Save QOTD with today's date
export async function cacheQOTD(quote: Quote) {
    try {
        const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
        await AsyncStorage.setItem(CACHED_QOTD_KEY, JSON.stringify({ date: today, quote }));
    } catch (e) { }
}

export async function getCachedQOTD(): Promise<Quote | null> {
    try {
        const json = await AsyncStorage.getItem(CACHED_QOTD_KEY);
        if (!json) return null;
        const { date, quote } = JSON.parse(json);
        const today = new Date().toISOString().slice(0, 10);
        if (date === today) return quote;
        return null;
    } catch (e) {
        return null;
    }
}