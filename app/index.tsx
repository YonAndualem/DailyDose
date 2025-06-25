import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { getQuoteOfTheDay, Quote } from "../utils/api";

export default function Index() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const data = await getQuoteOfTheDay();
      setQuote(data);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to load quote.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!quote) {
    return (
      <View style={styles.centered}>
        <Text>No quote found!</Text>
        <Button title="Try Again" onPress={fetchQuote} />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.quoteText}>{quote.quote}</Text>
      <Text style={styles.authorText}>{quote.author}</Text>
      <Button title="Reload" onPress={fetchQuote} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  quoteText: { fontSize: 20, fontStyle: "italic", textAlign: "center", marginBottom: 12 },
  authorText: { fontSize: 16, color: "#666", marginBottom: 24 },
});