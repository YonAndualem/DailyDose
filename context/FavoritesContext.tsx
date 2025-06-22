import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'DAILYDOSE_FAVORITES';

type FavoritesContextType = {
    favorites: string[];
    addFavorite: (quote: string) => void;
    removeFavorite: (quote: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    addFavorite: () => { },
    removeFavorite: () => { },
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const value = await AsyncStorage.getItem(FAVORITES_KEY);
            setFavorites(value ? JSON.parse(value) : []);
        })();
    }, []);

    const saveFavorites = async (newFavorites: string[]) => {
        setFavorites(newFavorites);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    };

    const addFavorite = (quote: string) => {
        if (!favorites.includes(quote)) {
            saveFavorites([...favorites, quote]);
        }
    };

    const removeFavorite = (quote: string) => {
        saveFavorites(favorites.filter(q => q !== quote));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};