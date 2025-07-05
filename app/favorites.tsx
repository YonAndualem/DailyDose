import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share, Platform, Modal, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getFavorites, removeFavorite } from "../utils/favorites";
import { Quote } from "../utils/api";
import ThemeChangeModal from "./components/ThemeChangeModal";
import { useThemeContext } from "../app/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { LinearGradient } from "expo-linear-gradient";

// Card to render for sharing as image
function QuoteImageCard({ quote, author, theme }: { quote: string, author: string, theme: any }) {
    return (
        <LinearGradient
            colors={[theme.primary, theme.secondary, theme.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                width: 320,
                borderRadius: 22,
                paddingVertical: 30,
                paddingHorizontal: 24,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.18,
                shadowRadius: 14,
                elevation: 7,
            }}
            collapsable={false}
        >
            <Text
                style={{
                    color: "#fff",
                    fontFamily: "Pacifico",
                    fontSize: 26,
                    marginBottom: 12,
                    letterSpacing: 1,
                    textShadowColor: "rgba(0,0,0,0.18)",
                    textShadowOffset: { width: 1, height: 2 },
                    textShadowRadius: 2,
                }}
            >
                DailyDose
            </Text>
            <Text
                style={{
                    fontSize: 21,
                    color: "#fff",
                    fontStyle: "italic",
                    textAlign: "center",
                    marginBottom: 18,
                    textShadowColor: "rgba(0,0,0,0.12)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                }}
            >
                "{quote}"
            </Text>
            <Text
                style={{
                    fontSize: 17,
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: 10,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0,0,0,0.10)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                }}
            >
                {author}
            </Text>
            <Text
                style={{
                    fontSize: 10,
                    color: "#f9f9f9",
                    textAlign: "center",
                    marginTop: 10,
                    opacity: 0.9,
                }}
            >
                {new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
            </Text>
        </LinearGradient>
    );
}

export default function FavoritesScreen() {
    const router = useRouter();

    // Use ThemeContext!
    const { themeType, setThemeType, theme } = useThemeContext();

    const [favorites, setFavorites] = useState<Quote[]>([]);
    const [themeModal, setThemeModal] = useState(false);

    // Remove modal state
    const [removeModal, setRemoveModal] = useState(false);
    const [pendingRemoveUuid, setPendingRemoveUuid] = useState<string | null>(null);

    // Refs for sharing image cards, one per quote uuid
    const imageRefs = useRef<{ [uuid: string]: View | null }>({});

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const favsObj = await getFavorites();
        // Convert to array if stored as object
        const favs: Quote[] = Array.isArray(favsObj)
            ? favsObj
            : Object.values(favsObj);
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

    const shareQuoteAsImage = async (quote: Quote) => {
        try {
            const ref = imageRefs.current[quote.uuid];
            if (!ref) throw new Error("Image ref not found.");
            const uri = await captureRef(ref, {
                format: "png",
                quality: 1,
            });
            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert("Error", "Could not share quote as image.");
        }
    };

    const handleRemove = async (uuid: string) => {
        await removeFavorite(uuid);
        setRemoveModal(false);
        setPendingRemoveUuid(null);
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
                                onPress={() => pendingRemoveUuid && handleRemove(pendingRemoveUuid)}
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

            {favorites.length === 0 ? (
                <Text style={styles(theme).empty}>No favorites yet!</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.uuid}
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
                                    onPress={() => shareQuoteAsImage(item)}
                                    accessibilityLabel="Share as image"
                                    style={{ marginRight: 20 }}
                                >
                                    <MaterialCommunityIcons name="image" size={24} color={theme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setPendingRemoveUuid(item.uuid);
                                        setRemoveModal(true);
                                    }}
                                    accessibilityLabel="Remove from favorites"
                                >
                                    <Ionicons name="trash-outline" size={24} color="#d72660" />
                                </TouchableOpacity>
                            </View>
                            {/* Hidden view for image sharing */}
                            <View
                                ref={ref => {
                                    imageRefs.current[item.uuid] = ref;
                                }}
                                collapsable={false}
                                style={{ position: "absolute", left: -9999, top: -9999 }}
                            >
                                <QuoteImageCard quote={item.quote} author={item.author} theme={theme} />
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