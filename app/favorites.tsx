import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, removeFavorite } from "../utils/favorites";
import { Quote } from "../utils/api";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<Quote[]>([]);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const styles = getStyles(isDark);

    const loadFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const shareQuote = async (quote: Quote) => {
        try {
            await Share.share({
                message: `"${quote.quote}" — ${quote.author}`,
            });
        } catch (error) {
            Alert.alert("Error", "Could not open share dialog.");
        }
    };

    const handleRemove = async (id: number) => {
        await removeFavorite(id);
        loadFavorites();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Favorite Quotes</Text>
            {favorites.length === 0 ? (
                <Text style={styles.empty}>No favorites yet!</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.quoteCard}>
                            <Text style={styles.quoteText}>"{item.quote}"</Text>
                            <Text style={styles.authorText}>— {item.author}</Text>
                            <View style={styles.actionsRow}>
                                <TouchableOpacity
                                    onPress={() => shareQuote(item)}
                                    style={{ marginRight: 16 }}
                                    accessibilityLabel="Share this quote"
                                >
                                    <Ionicons name="share-social-outline" size={22} color="#4a90e2" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        Alert.alert(
                                            "Remove Favorite",
                                            "Remove this quote from favorites?",
                                            [
                                                { text: "Cancel", style: "cancel" },
                                                { text: "Remove", style: "destructive", onPress: () => handleRemove(item.id) },
                                            ]
                                        )
                                    }
                                    accessibilityLabel="Remove from favorites"
                                >
                                    <Ionicons name="trash-outline" size={22} color="#d72660" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: isDark ? "#111" : "#fff" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: isDark ? "#ffd700" : "#f5a623" },
    empty: { textAlign: "center", color: "#aaa", fontSize: 16, marginTop: 40 },
    quoteCard: {
        backgroundColor: isDark ? "#23272e" : "#f5f5f5",
        borderRadius: 12,
        padding: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.18 : 0.07,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
    },
    quoteText: { fontSize: 16, fontStyle: "italic", color: isDark ? "#fff" : "#333", marginBottom: 10 },
    authorText: { fontSize: 14, color: isDark ? "#aaa" : "#555" },
    actionsRow: {
        position: "absolute",
        top: 8,
        right: 8,
        flexDirection: "row",
        alignItems: "center",
    },
});