import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'DAILYDOSE_FAVORITES';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const value = await AsyncStorage.getItem(FAVORITES_KEY);
                if (value) setFavorites(JSON.parse(value));
            } catch (e) {
                // Handle error if needed
            }
        };
        loadFavorites();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Favorite Quotes</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quote}>"{item}"</Text>
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
    quote: { fontSize: 18, fontStyle: 'italic', color: '#333' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 },
});