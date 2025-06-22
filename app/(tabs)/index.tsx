import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Share, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quotes } from '../../constants/quotes';

const FAVORITES_KEY = 'DAILYDOSE_FAVORITES';

export default function HomeScreen() {
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const today = new Date().toLocaleDateString();

    useEffect(() => {
        loadFavorites();
    }, []);

    async function loadFavorites() {
        try {
            const value = await AsyncStorage.getItem(FAVORITES_KEY);
            if (value) setFavorites(JSON.parse(value));
        } catch (e) {
            // handle error
        }
    }

    async function saveFavorites(newFavorites: string[]) {
        try {
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        } catch (e) {
            // handle error
        }
    }

    function reloadQuote() {
        let newQuote = currentQuote;
        while (newQuote === currentQuote && quotes.length > 1) {
            newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        }
        setCurrentQuote(newQuote);
    }

    const shareQuote = async () => {
        try {
            await Share.share({
                message: `"${currentQuote}"\n\nShared from DailyDose ✨`,
            });
        } catch (error) {
            alert('Failed to share the quote.');
        }
    };

    const isFavorite = favorites.includes(currentQuote);

    const toggleFavorite = async () => {
        let newFavorites;
        if (isFavorite) {
            newFavorites = favorites.filter(q => q !== currentQuote);
        } else {
            newFavorites = [...favorites, currentQuote];
        }
        setFavorites(newFavorites);
        await saveFavorites(newFavorites);
    };

    const showFavorites = () => {
        if (favorites.length === 0) {
            Alert.alert('Favorites', 'You have no favorite quotes yet!');
            return;
        }
        Alert.alert('Favorites', favorites.join('\n\n'));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.quote}>{currentQuote}</Text>
            <Button title="Reload" onPress={reloadQuote} />
            <View style={{ height: 10 }} />
            <Button title="Share" onPress={shareQuote} />
            <View style={{ height: 10 }} />
            <Button
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                onPress={toggleFavorite}
                color={isFavorite ? "#e63946" : "#457b9d"}
            />
            <View style={{ height: 10 }} />
            <Button title="Show Favorites" onPress={showFavorites} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f1f1f1',
    },
    date: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    quote: {
        fontSize: 24,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 40,
    },
});