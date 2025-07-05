import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Share, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQuoteOfTheDay, getAllQuoteUuids, getQuoteByUuid, Quote } from "../utils/api";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";
import ThemeChangeModal from "./components/ThemeChangeModal";
import { useThemeContext } from "./context/ThemeContext";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { cacheQuotes, getCachedQuotes, cacheQOTD, getCachedQOTD } from "../utils/quotesCache";
import { LinearGradient } from "expo-linear-gradient";

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

function getHolidayGreeting(): string | null {
  const today = new Date();
  if (today.getMonth() === 11 && today.getDate() === 25) return "Christmas";
  return null;
}

export default function HomeScreen() {
  const router = useRouter();
  const { themeType, setThemeType, theme } = useThemeContext();

  // QOTD state
  const [qotd, setQotd] = useState<Quote | null>(null);
  const [qotdLoading, setQotdLoading] = useState(true);
  const [qotdIsFavorite, setQotdIsFavorite] = useState(false);

  // Random quote state
  const [availableUuids, setAvailableUuids] = useState<string[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [randomQuoteLoading, setRandomQuoteLoading] = useState(true);
  const [randomIsFavorite, setRandomIsFavorite] = useState(false);

  // UI & theme state
  const [themeModal, setThemeModal] = useState(false);
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
  const [holiday, setHoliday] = useState<string | null>(null);

  const qotdImageRef = useRef<View>(null);
  const randomImageRef = useRef<View>(null);

  // Fetch personal data and holiday
  useEffect(() => {
    getUserPersonalData().then(data => setPersonalData(data));
    setHoliday(getHolidayGreeting());
  }, []);

  // QOTD logic
  useEffect(() => {
    const fetchQotd = async () => {
      setQotdLoading(true);
      try {
        const cached = await getCachedQOTD();
        if (cached) {
          setQotd(cached);
          setQotdIsFavorite(await isFavorite(cached.uuid));
          setQotdLoading(false);
          return;
        }
        const data = await getQuoteOfTheDay();
        setQotd(data);
        setQotdIsFavorite(await isFavorite(data.uuid));
        await cacheQOTD(data);
        const cache = await getCachedQuotes() || [];
        const newCache = [data, ...cache.filter(q => q.uuid !== data.uuid)];
        await cacheQuotes(newCache);
      } catch {
        const cached = await getCachedQOTD();
        if (cached) {
          setQotd(cached);
          setQotdIsFavorite(await isFavorite(cached.uuid));
        } else {
          const cache = await getCachedQuotes();
          if (cache && cache.length > 0) {
            setQotd(cache[0]);
            setQotdIsFavorite(await isFavorite(cache[0].uuid));
          } else {
            setQotd(null);
          }
        }
      }
      setQotdLoading(false);
    };
    fetchQotd();
  }, []);

  // --- Fetch all uuids for random quote logic (only once) ---
  useEffect(() => {
    const fetchAllUuids = async () => {
      try {
        const uuids = await getAllQuoteUuids();
        setAvailableUuids(uuids);
      } catch {
        setAvailableUuids([]);
      }
    };
    fetchAllUuids();
  }, []);

  // --- On availableUuids loaded, fetch a random quote ---
  useEffect(() => {
    if (availableUuids.length === 0) return;
    getRandomQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableUuids]);

  // --- Always pick a different random quote on reload ---
  const getRandomQuote = async () => {
    setRandomQuoteLoading(true);
    try {
      if (availableUuids.length === 0) {
        setRandomQuote(null);
        setRandomIsFavorite(false);
        setRandomQuoteLoading(false);
        return;
      }
      const currentUuid = randomQuote?.uuid;
      let possibleUuids = availableUuids;
      if (currentUuid && availableUuids.length > 1) {
        possibleUuids = availableUuids.filter(uuid => uuid !== currentUuid);
      }
      const nextUuid = possibleUuids[Math.floor(Math.random() * possibleUuids.length)];
      const data = await getQuoteByUuid(nextUuid);
      setRandomQuote(data);
      setRandomIsFavorite(await isFavorite(data.uuid));
      // Save to cache
      const cache = await getCachedQuotes() || [];
      const newCache = [data, ...cache.filter(q => q.uuid !== data.uuid)];
      await cacheQuotes(newCache.slice(0, 20));
    } catch {
      setRandomQuote(null);
      setRandomIsFavorite(false);
    }
    setRandomQuoteLoading(false);
  };

  const toggleQotdFavorite = async () => {
    if (!qotd) return;
    if (qotdIsFavorite) {
      await removeFavorite(qotd.uuid);
      setQotdIsFavorite(false);
    } else {
      await addFavorite(qotd);
      setQotdIsFavorite(true);
    }
  };

  const toggleRandomFavorite = async () => {
    if (!randomQuote) return;
    if (randomIsFavorite) {
      await removeFavorite(randomQuote.uuid);
      setRandomIsFavorite(false);
    } else {
      await addFavorite(randomQuote);
      setRandomIsFavorite(true);
    }
  };

  const shareQuoteAsImage = async (which: "qotd" | "random") => {
    const ref = which === "qotd" ? qotdImageRef : randomImageRef;
    try {
      const uri = await captureRef(ref, {
        format: "png",
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", "Could not share quote as image.");
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

  const navIcons = [
    { name: "settings", icon: <Ionicons name="settings-outline" size={26} color={theme.primary} />, onPress: () => router.push("/settings") },
    { name: "home", icon: <Ionicons name="home" size={32} color={theme.primary} />, onPress: () => { } },
    { name: "favorites", icon: <Ionicons name="star-outline" size={26} color={theme.primary} />, onPress: () => router.push("/favorites") },
  ];

  const cardHeight = 270;

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

      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => router.push("/profile")} accessibilityLabel="Profile">
          <Ionicons name="person-circle-outline" size={34} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles(theme).logo, { color: theme.text, fontFamily: "Pacifico" }]}>DailyDose</Text>
        <TouchableOpacity onPress={() => setThemeModal(true)} accessibilityLabel="Change Theme">
          <Ionicons name="color-palette-outline" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <Text style={styles(theme).date}>{dateStr}</Text>
      {holiday && <Text style={styles(theme).greeting}>Happy {holiday}!</Text>}
      {!holiday && <Text style={styles(theme).greeting}>
        {personalData?.name ? `Hi ${personalData.name}!` : "Hi!"}
      </Text>}

      <View style={styles(theme).quoteCardsContainer}>
        <View style={[styles(theme).quoteCard, { height: cardHeight }]}>
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
            <TouchableOpacity onPress={() => shareQuoteAsImage("qotd")} accessibilityLabel="Share as Image">
              <MaterialCommunityIcons name="image" size={24} color={theme.primary} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareQuote(qotd || undefined)} accessibilityLabel="Share as Text">
              <Ionicons name="share-social-outline" size={24} color={theme.primary} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles(theme).quoteCard, { height: cardHeight }]}>
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
            <TouchableOpacity onPress={() => shareQuoteAsImage("random")} accessibilityLabel="Share as Image">
              <MaterialCommunityIcons name="image" size={24} color={theme.primary} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareQuote(randomQuote || undefined)} accessibilityLabel="Share as Text">
              <Ionicons name="share-social-outline" size={24} color={theme.primary} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={getRandomQuote} accessibilityLabel="Reload" style={{ marginLeft: 20 }}>
              <MaterialCommunityIcons name="reload" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* --- HIDDEN IMAGE VIEWS FOR SHARING --- */}
      <View style={{ position: "absolute", left: -9999, top: -9999 }}>
        {qotd && (
          <View ref={qotdImageRef} collapsable={false}>
            <QuoteImageCard
              quote={qotd.quote}
              author={qotd.author}
              theme={theme}
            />
          </View>
        )}
        {randomQuote && (
          <View ref={randomImageRef} collapsable={false}>
            <QuoteImageCard
              quote={randomQuote.quote}
              author={randomQuote.author}
              theme={theme}
            />
          </View>
        )}
      </View>

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

const styles = (theme: any) =>
  StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "flex-start" },
    header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: Platform.OS === "ios" ? 60 : 30,
      paddingHorizontal: 18,
      marginBottom: 5,
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
      marginTop: 0,
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