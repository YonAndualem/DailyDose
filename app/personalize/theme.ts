import { StyleSheet } from "react-native";

export type ThemeType = "dark" | "light" | "gradient";

export const themes = {
    dark: {
        background: "#161F35",
        card: "#232B45",
        primary: "#9147FF",
        secondary: "#30395c",
        text: "#fff",
        textSecondary: "#bbb",
        input: "#232B45",
        inputText: "#fff",
        border: "#30395c",
        buttonText: "#fff",
        optionBg: "#232B45",
        optionSelectedBg: "#9147FF",
        optionText: "#bbb",
        optionSelectedText: "#fff",
        gradientColors: ["#232B45", "#161F35"], // fallback for gradient
    },
    light: {
        background: "#f8f8ff",
        card: "#fff",
        primary: "#9147FF",
        secondary: "#d1d5db",
        text: "#222",
        textSecondary: "#666",
        input: "#f3f4f6",
        inputText: "#222",
        border: "#e2e8f0",
        buttonText: "#fff",
        optionBg: "#f3f4f6",
        optionSelectedBg: "#9147FF",
        optionText: "#666",
        optionSelectedText: "#fff",
        gradientColors: ["#fff", "#f8f8ff"], // fallback for gradient
    },
    gradient: {
        background: "linear-gradient(135deg, #9147FF 0%, #232B45 100%)",
        card: "rgba(255,255,255,0.15)",
        primary: "#9147FF",
        secondary: "#232B45",
        text: "#fff",
        textSecondary: "#eee",
        input: "rgba(255,255,255,0.2)",
        inputText: "#fff",
        border: "#9147FF",
        buttonText: "#fff",
        optionBg: "rgba(255,255,255,0.18)",
        optionSelectedBg: "#9147FF",
        optionText: "#fff",
        optionSelectedText: "#fff",
        gradientColors: ["#9147FF", "#232B45"],
    },
};

export function getTheme(theme: ThemeType) {
    return themes[theme];
}

/**
 * Example usage in a component:
 * 
 * import { getTheme, ThemeType } from "./theme";
 * 
 * const theme = getTheme(currentTheme as ThemeType);
 * <View style={{ backgroundColor: theme.background }}>
 *   <Text style={{ color: theme.text }}>Hello!</Text>
 * </View>
 */

/**
 * Utility style generator for common UI components.
 * Pass the current theme object to get styles.
 */
export function makeStyles(theme: typeof themes.dark | typeof themes.light | typeof themes.gradient) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 18,
            width: "95%",
            marginBottom: 20,
        },
        label: {
            color: theme.text,
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 14,
            textAlign: "center",
        },
        textInput: {
            width: "85%",
            height: 48,
            borderRadius: 12,
            backgroundColor: theme.input,
            color: theme.inputText,
            paddingHorizontal: 16,
            fontSize: 17,
            marginBottom: 22,
            borderWidth: 1,
            borderColor: theme.border,
            textAlign: "center",
        },
        button: {
            backgroundColor: theme.primary,
            borderRadius: 25,
            paddingVertical: 13,
            paddingHorizontal: 36,
            marginTop: 12,
            alignSelf: "center",
            minWidth: 120,
        },
        buttonText: {
            color: theme.buttonText,
            fontWeight: "bold",
            fontSize: 17,
            textAlign: "center",
        },
        secondaryButton: {
            backgroundColor: theme.optionBg,
            borderRadius: 25,
            paddingVertical: 13,
            paddingHorizontal: 24,
            marginTop: 12,
            marginRight: 10,
            alignSelf: "center",
            minWidth: 80,
            borderWidth: 1,
            borderColor: theme.border,
        },
        secondaryButtonText: {
            color: theme.textSecondary,
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
        },
        optionButton: {
            backgroundColor: theme.optionBg,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 30,
            marginVertical: 7,
            minWidth: 180,
            borderWidth: 1,
            borderColor: theme.border,
        },
        optionButtonSelected: {
            backgroundColor: theme.optionSelectedBg,
            borderColor: theme.primary,
        },
        optionText: {
            color: theme.optionText,
            fontSize: 16,
            textAlign: "center",
        },
        optionTextSelected: {
            color: theme.optionSelectedText,
            fontWeight: "bold",
        },
    });
}