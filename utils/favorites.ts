import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quote } from "./api";

const FAVORITES_KEY = "favorite_quotes";

// Store as an object for fast lookup and easy uuid migration
export async function getFavorites(): Promise<{ [uuid: string]: Quote }> {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!json) return {};
    try {
        const obj = JSON.parse(json);
        // Migrate array to object if needed (legacy support)
        if (Array.isArray(obj)) {
            const asObj: { [uuid: string]: Quote } = {};
            for (const q of obj) {
                if (q.uuid) {
                    asObj[q.uuid] = q;
                }
            }
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(asObj));
            return asObj;
        }
        return obj;
    } catch {
        return {};
    }
}

export async function isFavorite(uuid: string): Promise<boolean> {
    const favorites = await getFavorites();
    return !!favorites[uuid];
}

export async function addFavorite(quote: Quote): Promise<void> {
    if (!quote.uuid) return;
    const favorites = await getFavorites();
    if (!favorites[quote.uuid]) {
        favorites[quote.uuid] = quote;
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export async function removeFavorite(uuid: string): Promise<void> {
    const favorites = await getFavorites();
    if (favorites[uuid]) {
        delete favorites[uuid];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}