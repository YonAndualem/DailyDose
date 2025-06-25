import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { getDailyQuotes, Quote } from "../utils/api";

export default function Index() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await getDailyQuotes();
      setQuotes(data);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to load quotes.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No quotes found!</Text>
        <Button title="Try Again" onPress={fetchQuotes} />
      </View>
    );
  }

  // Display the first daily quote as an example
  const first = quotes[0];

  return (
    <View style={styles.centered}>
      <Text style={styles.quoteText}>{first.quote}</Text>
      <Text style={styles.authorText}>— {first.author}</Text>
      <Button title="Reload" onPress={fetchQuotes} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  quoteText: { fontSize: 20, fontStyle: "italic", textAlign: "center", marginBottom: 12 },
  authorText: { fontSize: 16, color: "#666", marginBottom: 24 },
});