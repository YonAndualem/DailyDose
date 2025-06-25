import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, ScrollView, Share, useColorScheme } from "react-native";
import { getQuoteOfTheDay, getAllCategories, getQuoteIdsByCategory, getQuoteById, Quote } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native";

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // QOTD state
  const [qotd, setQotd] = useState<Quote | null>(null);
  const [qotdLoading, setQotdLoading] = useState(true);
  const [qotdIsFavorite, setQotdIsFavorite] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Random quote state
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [randomQuoteLoading, setRandomQuoteLoading] = useState(true);
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [randomIsFavorite, setRandomIsFavorite] = useState(false);

  // QOTD fetch
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

  // Categories fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Effect: Load quote ids for current category
  useEffect(() => {
    const fetchQuoteIds = async () => {
      setRandomQuoteLoading(true);
      try {
        const ids = await getQuoteIdsByCategory(selectedCategory);
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
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to load random quote.");
      }
      setRandomQuoteLoading(false);
    };
    fetchQuoteIds();
  }, [selectedCategory]);

  // Reload random quote
  const reloadRandomQuote = async () => {
    if (availableIds.length === 0) return;
    setRandomQuoteLoading(true);
    try {
      const id = availableIds[Math.floor(Math.random() * availableIds.length)];
      const data = await getQuoteById(id);
      setRandomQuote(data);
      setRandomIsFavorite(await isFavorite(data.id));
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to load random quote.");
    }
    setRandomQuoteLoading(false);
  };

  // Toggle favorite for QOTD
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

  // Toggle favorite for Random Quote
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
    } catch (error) {
      Alert.alert("Error", "Could not open share dialog.");
    }
  };

  const styles = getStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      {/* Card 1: Quote of the Day */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Quote of the Day</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {!qotdLoading && qotd && (
              <>
                <TouchableOpacity onPress={() => shareQuote(qotd)} style={{ marginRight: 12 }}>
                  <Ionicons name="share-social-outline" size={26} color="#4a90e2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleQotdFavorite}>
                  <Ionicons
                    name={qotdIsFavorite ? "heart" : "heart-outline"}
                    size={28}
                    color="#d72660"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        {qotdLoading ? (
          <ActivityIndicator size="large" />
        ) : qotd ? (
          <>
            <Text style={styles.quoteText}>"{qotd.quote}"</Text>
            <Text style={styles.authorText}>— {qotd.author}</Text>
          </>
        ) : (
          <Text style={styles.error}>Could not load QOTD</Text>
        )}
      </View>

      {/* Category Picker */}
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Category:</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={setSelectedCategory}
        >
          <Picker.Item label="All" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
          ))}
        </Picker>
      </View>
     

      <Button
        title="Reset Onboarding"
        onPress={async () => {
          await AsyncStorage.removeItem("hasSeenOnboarding");
          alert("Onboarding flag cleared! Restart the app.");
        }}
      />
      {/* Card 2: Random Quote */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Random Quote</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {!randomQuoteLoading && randomQuote && (
              <>
                <TouchableOpacity onPress={() => shareQuote(randomQuote)} style={{ marginRight: 12 }}>
                  <Ionicons name="share-social-outline" size={26} color="#4a90e2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleRandomFavorite}>
                  <Ionicons
                    name={randomIsFavorite ? "heart" : "heart-outline"}
                    size={28}
                    color="#d72660"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        {randomQuoteLoading ? (
          <ActivityIndicator size="large" />
        ) : randomQuote ? (
          <>
            <Text style={styles.quoteText}>"{randomQuote.quote}"</Text>
            <Text style={styles.authorText}>— {randomQuote.author}</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={reloadRandomQuote}>
              <Ionicons name="refresh" size={24} color="#222" />
              <Text style={styles.reloadLabel}>Reload</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.error}>No quotes found for this category</Text>
        )}
      </View>

      {/* Favorites Button */}
      <TouchableOpacity
        style={styles.favoritesNavButton}
        onPress={() => router.push("/favorites")}
      >
        <Ionicons name="star" size={24} color="#f5a623" />
        <Text style={styles.favNavText}>View Favorites</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingVertical: 32, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#222" },
  quoteText: { fontSize: 18, fontStyle: "italic", textAlign: "center", color: "#222", marginBottom: 14 },
  authorText: { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 14 },
  error: { color: "#d72660", marginBottom: 18, fontSize: 16, textAlign: "center" },
  pickerWrapper: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 10 },
  pickerLabel: { fontSize: 16, marginRight: 10, color: "#222" },
  picker: { flex: 1, height: 44 },
  reloadButton: { alignItems: "center", justifyContent: "center" },
  reloadLabel: { fontSize: 13, color: "#555", marginTop: 3 },
  favoritesNavButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#fffbe6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f5a623",
  },
  favNavText: { marginLeft: 8, color: "#f5a623", fontWeight: "bold", fontSize: 16 },
});

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingVertical: 32, backgroundColor: isDark ? "#111" : "#fff" },
  card: {
    backgroundColor: isDark ? "#23272e" : "#f5f5f5",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.18 : 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: isDark ? "#ffd700" : "#222" },
  quoteText: { fontSize: 18, fontStyle: "italic", textAlign: "center", color: isDark ? "#fff" : "#222", marginBottom: 14 },
  authorText: { fontSize: 15, color: isDark ? "#aaa" : "#555", textAlign: "center", marginBottom: 14 },
  error: { color: "#d72660", marginBottom: 18, fontSize: 16, textAlign: "center" },
  pickerWrapper: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 10 },
  pickerLabel: { fontSize: 16, marginRight: 10, color: isDark ? "#ffd700" : "#222" },
  picker: { flex: 1, height: 44, color: isDark ? "#fff" : "#222", backgroundColor: isDark ? "#23272e" : "#fff" },
  reloadButton: { alignItems: "center", justifyContent: "center" },
  reloadLabel: { fontSize: 13, color: isDark ? "#aaa" : "#555", marginTop: 3 },
  favoritesNavButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: isDark ? "#222" : "#fffbe6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f5a623",
  },
  favNavText: { marginLeft: 8, color: "#f5a623", fontWeight: "bold", fontSize: 16 },
});