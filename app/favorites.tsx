import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share, Platform, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getFavorites, removeFavorite } from "../utils/favorites";
import { Quote } from "../utils/api";
import ThemeChangeModal from "./components/ThemeChangeModal";
import { useThemeContext } from "../app/context/ThemeContext"; // <-- Import the context

// Utility to load personalization data (optional, not needed for theme if using context)
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FavoritesScreen() {
    const router = useRouter();

    // Use ThemeContext!
    const { themeType, setThemeType, theme } = useThemeContext();

    const [favorites, setFavorites] = useState<Quote[]>([]);
    const [themeModal, setThemeModal] = useState(false);

    // Remove modal state
    const [removeModal, setRemoveModal] = useState(false);
    const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
    };

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
        setRemoveModal(false);
        setPendingRemoveId(null);
        loadFavorites();
    };

    // Bottom navigation
    const navIcons = [
        { name: "settings", icon: <Ionicons name="settings-outline" size={26} color={theme.primary} />, onPress: () => router.push("/settings") },
        { name: "home", icon: <Ionicons name="home" size={32} color={theme.primary} />, onPress: () => router.push("/home") },
        { name: "favorites", icon: <Ionicons name="star" size={26} color={theme.primary} />, onPress: () => { } },
    ];

    return (
        <View style={styles(theme).mainContainer}>
            <ThemeChangeModal
                visible={themeModal}
                onClose={() => setThemeModal(false)}
                onSelect={async (t) => {
                    setThemeType(t);
                }}
                currentTheme={themeType}
            />

            {/* Remove Modal */}
            <Modal
                transparent
                visible={removeModal}
                animationType="fade"
                onRequestClose={() => setRemoveModal(false)}
            >
                <View style={modalStyles.overlay}>
                    <View style={[modalStyles.modalBox, { backgroundColor: theme.card, borderRadius: 18 }]}>
                        <Text style={[modalStyles.title, { color: theme.primary }]}>Remove Favorite</Text>
                        <Text style={[modalStyles.message, { color: theme.text }]}>
                            Remove this quote from favorites?
                        </Text>
                        <View style={modalStyles.buttonRow}>
                            <Pressable style={[modalStyles.button, { backgroundColor: theme.secondary }]} onPress={() => setRemoveModal(false)}>
                                <Text style={[modalStyles.buttonText, { color: theme.text }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[modalStyles.button, modalStyles.removeButton]}
                                onPress={() => pendingRemoveId && handleRemove(pendingRemoveId)}
                            >
                                <Text style={[modalStyles.buttonText, { color: "#fff" }]}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles(theme).header}>
                <TouchableOpacity onPress={() => router.push("/profile")} accessibilityLabel="Profile">
                    <Ionicons name="person-circle-outline" size={34} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles(theme).logo, { color: theme.text, fontFamily: "Pacifico" }]}>Favorites</Text>
                <TouchableOpacity onPress={() => setThemeModal(true)} accessibilityLabel="Change Theme">
                    <Ionicons name="color-palette-outline" size={28} color={theme.text} />
                </TouchableOpacity>
            </View>

            <Text style={styles(theme).title}>Your Favorite Quotes</Text>
            {favorites.length === 0 ? (
                <Text style={styles(theme).empty}>No favorites yet!</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 110, paddingTop: 8 }}
                    renderItem={({ item }) => (
                        <View style={styles(theme).quoteCard}>
                            <Text style={styles(theme).quoteText}>"{item.quote}"</Text>
                            <Text style={styles(theme).authorText}>{item.author}</Text>
                            <View style={styles(theme).cardActions}>
                                <TouchableOpacity
                                    onPress={() => shareQuote(item)}
                                    accessibilityLabel="Share this quote"
                                    style={{ marginRight: 20 }}
                                >
                                    <Ionicons name="share-social-outline" size={24} color={theme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setPendingRemoveId(item.id);
                                        setRemoveModal(true);
                                    }}
                                    accessibilityLabel="Remove from favorites"
                                >
                                    <Ionicons name="trash-outline" size={24} color="#d72660" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Bottom Navigation */}
            <View style={[styles(theme).navBar, { backgroundColor: theme.background }]}>
                {navIcons.map((item, idx) => (
                    <TouchableOpacity key={item.name} style={styles(theme).navIcon} onPress={item.onPress}>
                        {item.icon}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = (theme: ReturnType<typeof import("./personalize/theme").getTheme>) =>
    StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "flex-start" },
        header: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: Platform.OS === "ios" ? 60 : 30,
            paddingHorizontal: 18,
            marginBottom: 8,
        },
        logo: { fontSize: 32, letterSpacing: 0.5, textAlign: "center" },
        title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: theme.primary },
        empty: { textAlign: "center", color: "#aaa", fontSize: 16, marginTop: 40 },
        quoteCard: {
            backgroundColor: theme.card,
            borderRadius: 18,
            paddingVertical: 24,
            paddingHorizontal: 18,
            marginBottom: 18,
            marginHorizontal: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.10,
            shadowRadius: 8,
            elevation: 3,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
            width: "94%",
            alignSelf: "center",
        },
        quoteText: { fontSize: 16, fontStyle: "italic", color: theme.text, marginBottom: 10, textAlign: "center" },
        authorText: { fontSize: 14, color: theme.textSecondary, textAlign: "center" },
        cardActions: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            gap: 18,
        },
        navBar: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            height: 64,
            borderTopWidth: 1,
            borderColor: theme.secondary,
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            backgroundColor: theme.background,
        },
        navIcon: { flex: 1, alignItems: "center", justifyContent: "center" },
    });

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#0009",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        minWidth: 260,
        padding: 28,
        alignItems: "center",
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },
    message: {
        fontSize: 17,
        fontWeight: "400",
        marginBottom: 26,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 8,
        gap: 14,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
    },
    removeButton: {
        backgroundColor: "#d72660",
    },
});