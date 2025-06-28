import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const religions = ["None", "Christianity", "Islam", "Judaism", "Other"];

export default function ReligionStep({
    value,
    onChange,
    onNext,
    onPrev,
}: {
    value: string;
    onChange: (v: string) => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>Select your religion (optional)</Text>
            {religions.map((r) => (
                <TouchableOpacity
                    key={r}
                    style={[
                        styles.optionButton,
                        value === r && styles.optionButtonSelected,
                    ]}
                    onPress={() => onChange(r)}
                >
                    <Text
                        style={[
                            styles.optionText,
                            value === r && styles.optionTextSelected,
                        ]}
                    >
                        {r}
                    </Text>
                </TouchableOpacity>
            ))}
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
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
    optionButton: {
        backgroundColor: "#232B45",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 30,
        marginVertical: 7,
        minWidth: 180,
        borderWidth: 1,
        borderColor: "#30395c",
    },
    optionButtonSelected: {
        backgroundColor: "#9147FF",
        borderColor: "#9147FF",
    },
    optionText: {
        color: "#bbb",
        fontSize: 16,
        textAlign: "center",
    },
    optionTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
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