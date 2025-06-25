import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quote } from "./api";

const FAVORITES_KEY = "favorite_quotes";

export async function getFavorites(): Promise<Quote[]> {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
}

export async function isFavorite(id: number): Promise<boolean> {
    const favorites = await getFavorites();
    return favorites.some(q => q.id === id);
}

export async function addFavorite(quote: Quote): Promise<void> {
    const favorites = await getFavorites();
    if (!favorites.some(q => q.id === quote.id)) {
        favorites.push(quote);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export async function removeFavorite(id: number): Promise<void> {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter(q => q.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
}