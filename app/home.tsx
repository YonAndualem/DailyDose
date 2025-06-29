import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Share, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQuoteOfTheDay, getAllCategories, getQuoteIdsByCategory, getQuoteById, Quote } from "../utils/api";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";
import ThemeChangeModal from "./components/ThemeChangeModal";
import { useThemeContext } from "./context/ThemeContext"; // <-- Use the theme context

// Utility to get all user personalization data from AsyncStorage
const getUserPersonalData = async (): Promise<{
  name?: string;
  username?: string;
  birthday?: string;
  religion?: string;
  mood?: string;
  lifeAspect?: string;
  theme?: string;
  frequency?: string;
} | null> => {
  const raw = await AsyncStorage.getItem("userPersonalData");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Utility: Check if today is a public holiday (mock, replace with real logic/api as needed)
function getHolidayGreeting(): string | null {
  const today = new Date();
  if (today.getMonth() === 11 && today.getDate() === 25) return "Christmas";
  // Add more holidays as needed
  return null;
}

export default function HomeScreen() {
  const router = useRouter();

  // ---- THEME CONTEXT ----
  const { themeType, setThemeType, theme } = useThemeContext();

  // QOTD state
  const [qotd, setQotd] = useState<Quote | null>(null);
  const [qotdLoading, setQotdLoading] = useState(true);
  const [qotdIsFavorite, setQotdIsFavorite] = useState(false);

  // Random quote state
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [randomQuoteLoading, setRandomQuoteLoading] = useState(true);
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [randomIsFavorite, setRandomIsFavorite] = useState(false);

  // Modal
  const [themeModal, setThemeModal] = useState(false);

  // Personalization data from async storage
  const [personalData, setPersonalData] = useState<{
    name?: string;
    username?: string;
    birthday?: string;
    religion?: string;
    mood?: string;
    lifeAspect?: string;
    theme?: string;
    frequency?: string;
  } | null>(null);

  // Holiday logic
  const [holiday, setHoliday] = useState<string | null>(null);

  useEffect(() => {
    // Load all personalization data
    getUserPersonalData().then(data => {
      setPersonalData(data);
    });
    setHoliday(getHolidayGreeting());
  }, []);

  useEffect(() => {
    const fetchQotd = async () => {
      setQotdLoading(true);
      try {
        const data = await getQuoteOfTheDay();
        setQotd(data);
        setQotdIsFavorite(await isFavorite(data.id));
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to load quote of the day.");
      }
      setQotdLoading(false);
    };
    fetchQotd();
  }, []);

  useEffect(() => {
    const fetchRandomQuote = async () => {
      setRandomQuoteLoading(true);
      try {
        // Get all categories
        const cats = await getAllCategories();
        // Filter out empty categories just in case
        const category = cats.length > 0 ? cats[Math.floor(Math.random() * cats.length)].name : "";
        // Get random quote id from category
        const ids = await getQuoteIdsByCategory(category);
        setAvailableIds(ids);
        if (ids.length > 0) {
          const id = ids[Math.floor(Math.random() * ids.length)];
          const data = await getQuoteById(id);
          setRandomQuote(data);
          setRandomIsFavorite(await isFavorite(data.id));
        } else {
          setRandomQuote(null);
          setRandomIsFavorite(false);
        }
      } catch {
        setRandomQuote(null);
        setRandomIsFavorite(false);
      }
      setRandomQuoteLoading(false);
    };
    fetchRandomQuote();
  }, []);

  const reloadRandomQuote = async () => {
    if (availableIds.length === 0) return;
    setRandomQuoteLoading(true);
    try {
      const id = availableIds[Math.floor(Math.random() * availableIds.length)];
      const data = await getQuoteById(id);
      setRandomQuote(data);
      setRandomIsFavorite(await isFavorite(data.id));
    } catch { }
    setRandomQuoteLoading(false);
  };

  const toggleQotdFavorite = async () => {
    if (!qotd) return;
    if (qotdIsFavorite) {
      await removeFavorite(qotd.id);
      setQotdIsFavorite(false);
    } else {
      await addFavorite(qotd);
      setQotdIsFavorite(true);
    }
  };

  const toggleRandomFavorite = async () => {
    if (!randomQuote) return;
    if (randomIsFavorite) {
      await removeFavorite(randomQuote.id);
      setRandomIsFavorite(false);
    } else {
      await addFavorite(randomQuote);
      setRandomIsFavorite(true);
    }
  };

  const shareQuote = async (quote?: Quote) => {
    if (!quote) return;
    try {
      await Share.share({
        message: `"${quote.quote}" — ${quote.author}`,
      });
    } catch { }
  };

  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" });

  // NAV (favorites button at the end)
  const navIcons = [
    { name: "settings", icon: <Ionicons name="settings-outline" size={26} color={theme.primary} />, onPress: () => router.push("/settings") },
    { name: "home", icon: <Ionicons name="home" size={32} color={theme.primary} />, onPress: () => { } },
    { name: "favorites", icon: <Ionicons name="star-outline" size={26} color={theme.primary} />, onPress: () => router.push("/favorites") },
  ];

  // Equal height for both cards
  const cardHeight = 210;

  return (
    <View style={styles(theme).mainContainer}>
      {/* Theme Modal */}
      <ThemeChangeModal
        visible={themeModal}
        onClose={() => setThemeModal(false)}
        onSelect={async (t) => {
          setThemeType(t); // <--- Use theme context!
        }}
        currentTheme={themeType}
      />

      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => router.push("/profile")} accessibilityLabel="Profile">
          <Ionicons name="person-circle-outline" size={34} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles(theme).logo, { color: theme.text, fontFamily: "Pacifico" }]}>DailyDose</Text>
        <TouchableOpacity onPress={() => setThemeModal(true)} accessibilityLabel="Change Theme">
          <Ionicons name="color-palette-outline" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Date and Greeting */}
      <Text style={styles(theme).date}>{dateStr}</Text>
      {holiday && <Text style={styles(theme).greeting}>Happy {holiday}!</Text>}
      {!holiday && <Text style={styles(theme).greeting}>
        {personalData?.name ? `Hi ${personalData.name}!` : "Hi!"}
      </Text>}

      {/* Two Quote Cards */}
      <View style={styles(theme).quoteCardsContainer}>
        <View style={[styles(theme).quoteCard, { height: cardHeight }]}>
          <Text style={styles(theme).cardTitle}>Quote of the day</Text>
          {qotdLoading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : qotd ? (
            <>
              <Text style={styles(theme).quoteText}>"{qotd.quote}"</Text>
              <Text style={styles(theme).authorText}>{qotd.author}</Text>
            </>
          ) : (
            <Text style={styles(theme).quoteText}>Could not load QOTD</Text>
          )}
          <View style={styles(theme).cardActions}>
            <TouchableOpacity onPress={toggleQotdFavorite} accessibilityLabel="Favorite">
              <Ionicons
                name={qotdIsFavorite ? "bookmark" : "bookmark-outline"}
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareQuote(qotd)} accessibilityLabel="Share">
              <Ionicons name="share-social-outline" size={24} color={theme.primary} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles(theme).quoteCard, { height: cardHeight }]}>
          <Text style={styles(theme).cardTitle}>Random</Text>
          {randomQuoteLoading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : randomQuote ? (
            <>
              <Text style={styles(theme).quoteText}>"{randomQuote.quote}"</Text>
              <Text style={styles(theme).authorText}>{randomQuote.author}</Text>
            </>
          ) : (
            <Text style={styles(theme).quoteText}>No quotes found</Text>
          )}
          <View style={styles(theme).cardActions}>
            <TouchableOpacity onPress={toggleRandomFavorite} accessibilityLabel="Favorite">
              <Ionicons
                name={randomIsFavorite ? "bookmark" : "bookmark-outline"}
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareQuote(randomQuote)} accessibilityLabel="Share">
              <Ionicons name="share-social-outline" size={24} color={theme.primary} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={reloadRandomQuote} accessibilityLabel="Reload" style={{ marginLeft: 20 }}>
              <MaterialCommunityIcons name="reload" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
    date: {
      fontSize: 15,
      color: theme.text,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 2,
      marginBottom: 0,
    },
    greeting: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 14,
      marginTop: 2,
    },
    quoteCardsContainer: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      width: "100%",
      gap: 16,
      marginTop: 8,
      marginBottom: 72,
    },
    quoteCard: {
      width: "87%",
      backgroundColor: theme.card,
      borderRadius: 22,
      paddingVertical: 22,
      paddingHorizontal: 18,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 1,
      minHeight: 150,
      marginVertical: 2,
    },
    cardTitle: {
      fontSize: 15,
      color: theme.textSecondary,
      marginBottom: 10,
      fontWeight: "400",
    },
    quoteText: {
      fontSize: 17,
      color: theme.text,
      fontStyle: "italic",
      textAlign: "center",
      marginBottom: 12,
    },
    authorText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 12,
    },
    cardActions: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      marginTop: 4,
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