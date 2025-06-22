import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'DAILYDOSE_FAVORITES';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    async function loadFavorites() {
        try {
            const value = await AsyncStorage.getItem(FAVORITES_KEY);
            if (value) setFavorites(JSON.parse(value));
        } catch (e) {
            // Handle error if needed
        }
    }

    async function removeFavorite(quote: string) {
        const newFavorites = favorites.filter(item => item !== quote);
        setFavorites(newFavorites);
        try {
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        } catch (e) {
            Alert.alert('Error', 'Failed to update favorites.');
        }
    }

    async function shareFavorite(quote: string) {
        try {
            await Share.share({
                message: `"${quote}"\n\nShared from DailyDose ✨`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share the quote.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Favorite Quotes</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quote}>"{item}"</Text>
                        <View style={styles.buttonRow}>
                            <Button title="Share" color="#457b9d" onPress={() => shareFavorite(item)} />
                            <View style={{ width: 10 }} />
                            <Button title="Remove" color="#e63946" onPress={() => removeFavorite(item)} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No favorites yet!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#fff' },
    heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    quoteContainer: { marginBottom: 18, padding: 16, backgroundColor: '#f1f1f1', borderRadius: 8 },
    quote: { fontSize: 18, fontStyle: 'italic', color: '#333', marginBottom: 8 },
    buttonRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 },
});