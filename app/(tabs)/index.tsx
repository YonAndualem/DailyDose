import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { quotes } from '../../constants/quotes';

export default function HomeScreen() {
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);
    const today = new Date().toLocaleDateString();

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.quote}>{currentQuote}</Text>
            <Button title="Reload" onPress={() => { /* Add reload logic next */ }} />
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