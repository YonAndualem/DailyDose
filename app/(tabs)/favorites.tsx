import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Share, TouchableOpacity, TextInput } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen() {
    const { favorites, removeFavorite, addFavorite } = useFavorites();
    const [search, setSearch] = useState('');
    const [recentlyRemoved, setRecentlyRemoved] = useState<string | null>(null);
    const [undoVisible, setUndoVisible] = useState(false);
    const [undoTimeout, setUndoTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    const filteredFavorites = favorites.filter(q =>
        q.toLowerCase().includes(search.trim().toLowerCase())
    );

    const shareFavorite = async (quote: string) => {
        try {
            await Share.share({
                message: `"${quote}"\n\nShared from DailyDose ✨`,
            });
        } catch (error) {
            alert('Failed to share the quote.');
        }
    };

    const handleRemove = (quote: string) => {
        removeFavorite(quote);
        setRecentlyRemoved(quote);
        setUndoVisible(true);
        if (undoTimeout) clearTimeout(undoTimeout);
        const timeout = setTimeout(() => {
            setUndoVisible(false);
            setRecentlyRemoved(null);
        }, 5000);
        setUndoTimeout(timeout);
    };

    const handleUndo = () => {
        if (recentlyRemoved) {
            addFavorite(recentlyRemoved);
        }
        setUndoVisible(false);
        setRecentlyRemoved(null);
        if (undoTimeout) clearTimeout(undoTimeout);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Favorite Quotes</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search favorites..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredFavorites}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quote}>"{item}"</Text>
                        <View style={styles.buttonRow}>
                            <Button title="Share" color="#457b9d" onPress={() => shareFavorite(item)} />
                            <View style={{ width: 10 }} />
                            <Button title="Remove" color="#e63946" onPress={() => handleRemove(item)} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No favorites yet!</Text>}
            />

            {/* Undo Snackbar */}
            {undoVisible && recentlyRemoved && (
                <View style={styles.snackbar}>
                    <Text style={{ color: '#fff', flex: 1 }}>Quote removed.</Text>
                    <TouchableOpacity onPress={handleUndo}>
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
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        fontSize: 16,
    },
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