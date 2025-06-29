import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeType, themes, getTheme } from "../personalize/theme";

type ThemeChangeModalProps = {
    visible: boolean;
    onClose: () => void;
    onSelect: (t: ThemeType) => void;
    currentTheme: ThemeType;
};

export default function ThemeChangeModal({
    visible,
    onClose,
    onSelect,
    currentTheme,
}: ThemeChangeModalProps) {
    const theme = getTheme(currentTheme);

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={modalStyles.overlay}>
                <View
                    style={[
                        modalStyles.modalBox,
                        { backgroundColor: theme.card },
                        currentTheme === "dark" && { borderColor: "#333", borderWidth: 1 },
                    ]}
                >
                    <Text style={[modalStyles.title, { color: theme.primary }]}>Choose Theme</Text>
                    {(Object.keys(themes).filter(t => t !== "gradient") as ThemeType[]).map((t) => (
                        <Pressable
                            key={t}
                            onPress={() => { onSelect(t); onClose(); }}
                            style={[
                                modalStyles.themeButton,
                                currentTheme === t && {
                                    backgroundColor: theme.primary + (currentTheme === "dark" ? "30" : "18"),
                                    borderColor: theme.primary,
                                    borderWidth: 2,
                                },
                            ]}
                        >
                            <Text style={[modalStyles.themeText, { color: theme.text }]}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                            {currentTheme === t && <Ionicons name="checkmark" size={20} color={theme.primary} />}
                        </Pressable>
                    ))}
                    <Pressable onPress={onClose} style={[modalStyles.closeBtn, { backgroundColor: theme.primary }]}>
                        <Text style={[modalStyles.closeText, { color: theme.buttonText }]}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#000A",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        borderRadius: 18,
        padding: 26,
        minWidth: 240,
        alignItems: "center",
        elevation: 8,
        ...Platform.select({
            android: { minWidth: 280 },
        }),
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
        fontWeight: "600",
    },
    themeButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginBottom: 8,
        minWidth: 170,
        justifyContent: "space-between",
    },
    themeText: {
        fontSize: 16,
        fontWeight: "600",
    },
    closeBtn: {
        marginTop: 18,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 28,
    },
    closeText: {
        fontSize: 16,
        fontWeight: "600",
    },
});