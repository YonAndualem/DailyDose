import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { getQuoteOfTheDay, getAllQuoteIds, getQuoteById, Quote } from "../utils/api";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  // QOTD state
  const [qotd, setQotd] = useState<Quote | null>(null);
  const [qotdLoading, setQotdLoading] = useState(true);

  // Random quote state
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [randomQuoteLoading, setRandomQuoteLoading] = useState(true);
  const [allIds, setAllIds] = useState<number[]>([]);

  // Fetch QOTD once on mount
  useEffect(() => {
    const fetchQotd = async () => {
      setQotdLoading(true);
      try {
        const data = await getQuoteOfTheDay();
        setQotd(data);
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to load quote of the day.");
      }
      setQotdLoading(false);
    };
    fetchQotd();
  }, []);

  // Fetch all IDs once on mount, and load first random quote
  useEffect(() => {
    const fetchIdsAndFirstQuote = async () => {
      setRandomQuoteLoading(true);
      try {
        const ids = await getAllQuoteIds();
        setAllIds(ids);
        if (ids.length > 0) {
          const id = ids[Math.floor(Math.random() * ids.length)];
          const data = await getQuoteById(id);
          setRandomQuote(data);
        }
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to load random quote.");
      }
      setRandomQuoteLoading(false);
    };
    fetchIdsAndFirstQuote();
  }, []);

  // Reload random quote
  const reloadRandomQuote = async () => {
    if (allIds.length === 0) return;
    setRandomQuoteLoading(true);
    try {
      const id = allIds[Math.floor(Math.random() * allIds.length)];
      const data = await getQuoteById(id);
      setRandomQuote(data);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to load random quote.");
    }
    setRandomQuoteLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Card 1: Quote of the Day */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quote of the Day</Text>
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

      {/* Card 2: Random Quote */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Random Quote</Text>
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
          <Text style={styles.error}>Could not load random quote</Text>
        )}
      </View>
    </View>
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
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#222" },
  quoteText: { fontSize: 18, fontStyle: "italic", textAlign: "center", color: "#222", marginBottom: 14 },
  authorText: { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 14 },
  reloadButton: { alignItems: "center", justifyContent: "center" },
  reloadLabel: { fontSize: 13, color: "#555", marginTop: 3 },
  error: { color: "#d72660", marginBottom: 18, fontSize: 16, textAlign: "center" },
});