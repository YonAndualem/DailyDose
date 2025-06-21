import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Share } from 'react-native';
import { quotes } from '../../constants/quotes';

export default function HomeScreen() {
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);
    const today = new Date().toLocaleDateString();

    function reloadQuote() {
        let newQuote = currentQuote;
        while (newQuote === currentQuote && quotes.length > 1) {
            newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        }
        setCurrentQuote(newQuote);
    }

    const shareQuote = async () => {
        try {
            await Share.share({
                message: `"${currentQuote}"\n\nShared from DailyDose ✨`,
            });
        } catch (error) {
            alert('Failed to share the quote.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.quote}>{currentQuote}</Text>
            <Button title="Reload" onPress={reloadQuote} />
            <View style={{ height: 10 }} />
            <Button title="Share" onPress={shareQuote} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f1f1f1',
    },
    date: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    quote: {
        fontSize: 24,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 40,
    },
});