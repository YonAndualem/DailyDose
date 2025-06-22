import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, Share, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'DAILYDOSE_FAVORITES';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recentlyRemoved, setRecentlyRemoved] = useState<string | null>(null);
    const [undoVisible, setUndoVisible] = useState(false);
    const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadFavorites();
        return () => {
            if (undoTimeout) clearTimeout(undoTimeout);
        };
    }, []);

    async function loadFavorites() {
        try {
            const value = await AsyncStorage.getItem(FAVORITES_KEY);
            if (value) setFavorites(JSON.parse(value));
        } catch (e) { }
    }

    async function saveFavorites(newFavorites: string[]) {
        try {
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        } catch (e) {
            Alert.alert('Error', 'Failed to update favorites.');
        }
    }

    async function removeFavorite(quote: string) {
        const newFavorites = favorites.filter(item => item !== quote);
        setFavorites(newFavorites);
        await saveFavorites(newFavorites);
        setRecentlyRemoved(quote);
        setUndoVisible(true);
        if (undoTimeout) clearTimeout(undoTimeout);
        const timeout = setTimeout(() => {
            setUndoVisible(false);
            setRecentlyRemoved(null);
        }, 5000); // 5 seconds
        setUndoTimeout(timeout);
    }

    async function undoRemove() {
        if (recentlyRemoved) {
            const newFavorites = [recentlyRemoved, ...favorites];
            setFavorites(newFavorites);
            await saveFavorites(newFavorites);
        }
        setUndoVisible(false);
        setRecentlyRemoved(null);
        if (undoTimeout) clearTimeout(undoTimeout);
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

            {/* Undo Snackbar */}
            {undoVisible && recentlyRemoved && (
                <View style={styles.snackbar}>
                    <Text style={{ color: '#fff', flex: 1 }}>Quote removed.</Text>
                    <TouchableOpacity onPress={undoRemove}>
                        <Text style={styles.undoText}>UNDO</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    snackbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 24,
        flexDirection: 'row',
        backgroundColor: '#333',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 24,
        elevation: 5,
    },
    undoText: {
        color: '#ffd166',
        fontWeight: 'bold',
        marginLeft: 16,
        fontSize: 16,
    },
});