import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SummaryStep({
    data,
    onFinish,
    onPrev,
}: {
    data: {
        name: string;
        username: string;
        birthday: string;
        religion: string;
        mood: string;
        lifeAspect: string;
        theme: string;
        frequency: string;
    };
    onFinish: () => void;
    onPrev: () => void;
}) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>All set, {data.name || "friend"}!</Text>
            <Text style={styles.summaryText}>Welcome to DailyDose. Embrace your journey to happiness!</Text>
            <TouchableOpacity style={styles.button} onPress={onFinish}>
                <Text style={styles.buttonText}>Go to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                <Text style={styles.secondaryButtonText}>Back</Text>
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
    label: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 14,
        textAlign: "center",
    },
    summaryText: {
        color: "#bbb",
        fontSize: 16,
        marginVertical: 18,
        textAlign: "center",
        paddingHorizontal: 10,
    },
    summaryBox: {
        backgroundColor: "#232B45",
        borderRadius: 14,
        padding: 18,
        width: "95%",
        marginBottom: 20,
    },
    summaryItem: {
        color: "#fff",
        fontSize: 16,
        marginVertical: 2,
    },
    summaryItemLabel: {
        color: "#9147FF",
        fontWeight: "bold",
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
    secondaryButton: {
        backgroundColor: "#232B45",
        borderRadius: 25,
        paddingVertical: 13,
        paddingHorizontal: 24,
        marginTop: 12,
        marginRight: 10,
        alignSelf: "center",
        minWidth: 80,
        borderWidth: 1,
        borderColor: "#30395c",
    },
    secondaryButtonText: {
        color: "#aaa",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});