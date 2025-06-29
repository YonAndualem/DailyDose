import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { getDaysInMonth, isValid, parse } from "date-fns";

export default function StepBirthday({
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
    // Split the value to fields, fallback to blanks
    let [year, month, day] = value ? value.split("-") : ["", "", ""];
    const [error, setError] = useState<string | null>(null);

    // Helper for 0-padding
    const pad = (str: string, len: number) => str.padStart(len, "0");

    // Validation function
    const validateDate = (y: string, m: string, d: string) => {
        if (!y || !m || !d) return false;
        const dateStr = `${y}-${pad(m, 2)}-${pad(d, 2)}`;
        const date = parse(dateStr, "yyyy-MM-dd", new Date());
        return isValid(date) && +y > 1900 && +m >= 1 && +m <= 12 && +d >= 1 && +d <= 31;
    };

    const handleChange = (key: "year" | "month" | "day", v: string) => {
        let newYear = year, newMonth = month, newDay = day;
        if (key === "year") newYear = v;
        if (key === "month") newMonth = v;
        if (key === "day") newDay = v;

        // Validation: Only numeric input
        if (!/^\d*$/.test(v)) return;

        // Update parent value
        onChange(`${newYear}-${newMonth}-${newDay}`);
        setError(null);
    };

    const handleNext = () => {
        if (validateDate(year, month, day)) {
            setError(null);
            onNext();
        } else {
            setError("Please enter a valid date.");
        }
    };

    // Days in selected month/year
    const daysInMonth =
        year && month && /^\d+$/.test(year) && /^\d+$/.test(month)
            ? getDaysInMonth(new Date(+year, +month - 1))
            : 31;

    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>When is your birthday?</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.dateInput}
                    keyboardType="numeric"
                    maxLength={4}
                    placeholder="YYYY"
                    value={year}
                    onChangeText={(v) => {
                        const currentYear = new Date().getFullYear();
                        if (+v > currentYear) handleChange("year", String(currentYear));
                        else handleChange("year", v);
                    }}
                />
                <Text style={styles.sep}>/</Text>
                <TextInput
                    style={styles.dateInput}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="MM"
                    value={month}
                    onChangeText={(v) => {
                        if (+v > 12) handleChange("month", "12");
                        else handleChange("month", v);
                    }}
                />
                <Text style={styles.sep}>/</Text>
                <TextInput
                    style={styles.dateInput}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="DD"
                    value={day}
                    onChangeText={(v) => {
                        const daysInSelectedMonth = getDaysInMonth(
                            year && month ? new Date(+year, +month - 1) : new Date()
                        );
                        if (+v > daysInSelectedMonth) handleChange("day", String(daysInSelectedMonth));
                        else handleChange("day", v);
                    }}
                />
            </View>
            {error && <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>}
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        justifyContent: "center",
    },
    dateInput: {
        backgroundColor: "#232B45",
        color: "#fff",
        borderRadius: 8,
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        textAlign: "center",
        width: 70,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: "#30395c",
    },
    sep: {
        color: "#fff",
        fontSize: 20,
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