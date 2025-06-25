import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.welcomeTitle}>WELCOME</Text>
            <Text style={styles.welcomeText}>
                This is your first time here, so let's personalize your experience.
            </Text>
            <Text style={styles.welcomeText2}>
                Ready to start?
            </Text>

            <TouchableOpacity style={styles.button} onPress={onNext}>
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    stepContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
    },
    logo: {
        fontSize: 32,
        color: "#fff",
        marginBottom: 18,
        textAlign: "center",
    },
    welcomeTitle: {
        fontSize: 26,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    welcomeText: {
        fontSize: 16,
        color: "#bbb",
        marginBottom: 28,
        textAlign: "center",
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: "#9147FF",
        borderRadius: 25,
        paddingVertical: 13,
        paddingHorizontal: 36,
        marginTop: 12,
        alignSelf: "center",
        minWidth: 120,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 17,
        textAlign: "center",
    },
    welcomeText2: {
        fontSize: 16,
        color: "#bbb",
        marginBottom: 28,
        textAlign: "center",
        paddingHorizontal: 8,
    },
});