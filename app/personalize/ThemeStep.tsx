import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

// Example theme previews, adjust paths as needed for your project
const quoteThemes = [
    { key: "dark", label: "Dark", preview: require("../../assets/images/onboarding/onboarding1.png") },
    { key: "light", label: "Light", preview: require("../../assets/images/onboarding/onboarding1.png") },
    { key: "gradient", label: "Gradient", preview: require("../../assets/images/onboarding/onboarding1.png") },
    // Add your own themes and previews here
];

export default function ThemeStep({
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
            <Text style={styles.label}>Choose your quotes main theme</Text>
            <View style={styles.themeRow}>
                {quoteThemes.map((theme) => (
                    <TouchableOpacity
                        key={theme.key}
                        style={[
                            styles.themeButton,
                            value === theme.key && styles.themeButtonSelected,
                        ]}
                        onPress={() => onChange(theme.key)}
                    >
                        <Image source={theme.preview} style={styles.themePreview} />
                        <Text
                            style={[
                                styles.themeText,
                                value === theme.key && styles.themeTextSelected,
                            ]}
                        >
                            {theme.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
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
    themeRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
        justifyContent: "center",
    },
    themeButton: {
        backgroundColor: "#232B45",
        borderRadius: 10,
        margin: 4,
        borderWidth: 2,
        borderColor: "#232B45",
        alignItems: "center",
        width: 90,
        height: 100,
        justifyContent: "center",
    },
    themeButtonSelected: {
        borderColor: "#9147FF",
        backgroundColor: "#3a255b",
    },
    themePreview: {
        width: 70,
        height: 40,
        borderRadius: 6,
        marginBottom: 6,
        backgroundColor: "#222",
    },
    themeText: {
        color: "#bbb",
        fontSize: 14,
    },
    themeTextSelected: {
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