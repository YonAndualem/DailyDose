import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function NameStep({
    value,
    onChange,
    onNext,
    onPrev,
}: {
    value: string;
    onChange: (v: string) => void;
    onNext: () => void;
    onPrev?: () => void;
}) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
                placeholder="Type your name"
                placeholderTextColor="#888"
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                returnKeyType="done"
            />
            <View style={styles.row}>
                {onPrev && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                        <Text style={styles.secondaryButtonText}>Back</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value.trim()}>
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
        fontSize: 48,
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
    textInput: {
        width: "85%",
        height: 48,
        borderRadius: 12,
        backgroundColor: "#232B45",
        color: "#fff",
        paddingHorizontal: 16,
        fontSize: 17,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: "#30395c",
        textAlign: "center",
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