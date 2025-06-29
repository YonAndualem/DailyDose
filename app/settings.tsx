import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    ScrollView,
    Switch,
    Linking,
    Modal,
} from "react-native";
import { Ionicons, Feather, AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "./context/ThemeContext";
import { scheduleDailyQuoteNotification, cancelDailyQuoteNotification } from "../utils/notifications";

const SETTINGS_KEYS = {
    notifications: "userNotifications",
    dailyQuote: "userDailyQuote",
};

export default function SettingsScreen() {
    const router = useRouter();
    const { themeType, setThemeType, theme } = useThemeContext();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [dailyQuoteEnabled, setDailyQuoteEnabled] = useState(true);
    const [showThemeModal, setShowThemeModal] = useState(false);

    useEffect(() => {
        (async () => {
            const notif = await AsyncStorage.getItem(SETTINGS_KEYS.notifications);
            const dq = await AsyncStorage.getItem(SETTINGS_KEYS.dailyQuote);
            if (notif !== null) setNotificationsEnabled(notif === "true");
            if (dq !== null) setDailyQuoteEnabled(dq === "true");
        })();
    }, []);

    useEffect(() => {
        // When dailyQuoteEnabled changes, schedule or cancel notifications
        (async () => {
            if (dailyQuoteEnabled) {
                await scheduleDailyQuoteNotification();
            } else {
                await cancelDailyQuoteNotification();
            }
        })();
    }, [dailyQuoteEnabled]);

    const handleToggleNotifications = async (value: boolean) => {
        setNotificationsEnabled(value);
        await AsyncStorage.setItem(SETTINGS_KEYS.notifications, value.toString());
    };

    const handleToggleDailyQuote = async (value: boolean) => {
        setDailyQuoteEnabled(value);
        await AsyncStorage.setItem(SETTINGS_KEYS.dailyQuote, value.toString());
        // The useEffect above will handle scheduling/cancelling the notification
    };

    const handleThemeChange = () => {
        setShowThemeModal(true);
    };

    const setThemeAndClose = (type: string) => {
        setThemeType(type as "light" | "dark");
        setShowThemeModal(false);
    };

    // Social links
    const handleOpenLink = (type: "github" | "linkedin" | "instagram") => {
        let url = "";
        if (type === "github") url = "https://github.com/YonAndualem";
        if (type === "linkedin") url = "https://linkedin.com/in/YonAndualem";
        if (type === "instagram") url = "https://instagram.com/YonAndualem";
        Linking.openURL(url);
    };

    // Choose icon color for Connect icons (match theme)
    const connectIconColor = themeType === "dark"
        ? "#fff"
        : theme.primary;

    return (
        <View style={styles(theme).mainContainer}>
            <View style={styles(theme).header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles(theme).circleButton}
                    accessibilityLabel="Back"
                >
                    <Ionicons
                        name="arrow-back-outline"
                        size={24}
                        color={
                            themeType === "dark"
                                ? "#fff"
                                : theme.text
                        }
                    />
                </TouchableOpacity>
                <Text style={[styles(theme).logo, { color: theme.text, fontFamily: "Pacifico" }]}>DailyDose</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles(theme).contentContainer}>
                <Text style={styles(theme).sectionTitle}>Preferences</Text>
                <SettingRow
                    label="Dark Mode"
                    value={themeType === "dark"}
                    onValueChange={handleThemeChange}
                    theme={theme}
                    isTheme
                />
                <SettingRow
                    label="Enable Notifications"
                    value={notificationsEnabled}
                    onValueChange={handleToggleNotifications}
                    theme={theme}
                />
                <SettingRow
                    label="Daily Quote Notification"
                    value={dailyQuoteEnabled}
                    onValueChange={handleToggleDailyQuote}
                    theme={theme}
                />

                <Text style={styles(theme).sectionTitle}>Connect</Text>
                <View style={styles(theme).socialRow}>
                    <SocialButton
                        icon={<AntDesign name="github" size={32} color={connectIconColor} />}
                        onPress={() => handleOpenLink("github")}
                        theme={theme}
                    />
                    <SocialButton
                        icon={<Feather name="linkedin" size={32} color={connectIconColor} />}
                        onPress={() => handleOpenLink("linkedin")}
                        theme={theme}
                    />
                    <SocialButton
                        icon={<FontAwesome name="instagram" size={32} color={connectIconColor} />}
                        onPress={() => handleOpenLink("instagram")}
                        theme={theme}
                    />
                </View>

                <Text style={styles(theme).sectionTitle}>About</Text>
                <View style={styles(theme).aboutBox}>
                    <Text style={styles(theme).aboutText}>
                        Version <Text style={{ fontWeight: "bold" }}>1.0.0</Text>
                    </Text>
                    <Text style={styles(theme).aboutText}>
                        Made by YonAndualem
                    </Text>
                    <Text style={styles(theme).aboutText}>
                        © {new Date().getFullYear()} DailyDose
                    </Text>
                </View>
            </ScrollView>

            {/* THEME MODAL */}
            <Modal
                visible={showThemeModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowThemeModal(false)}
            >
                <View style={styles(theme).modalOverlay}>
                    <View style={[
                        styles(theme).modalBox,
                        themeType === "dark" && { backgroundColor: theme.primary }
                    ]}>
                        <Text style={[
                            styles(theme).modalTitle,
                            themeType === "dark" && { color: "#fff" }
                        ]}>Choose Theme</Text>
                        <View style={styles(theme).modalBtns}>
                            <TouchableOpacity
                                style={[
                                    styles(theme).modalBtn,
                                    themeType === "light" && styles(theme).modalBtnSelected,
                                ]}
                                onPress={() => setThemeAndClose("light")}
                            >
                                <Ionicons name="sunny-outline" size={24} color={themeType === "light" ? theme.primary : theme.text} />
                                <Text style={[
                                    styles(theme).modalBtnText,
                                    themeType === "light" && styles(theme).modalBtnTextSelected,
                                ]}>Light</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles(theme).modalBtn,
                                    themeType === "dark" && [styles(theme).modalBtnSelected, { backgroundColor: "#fff1" }],
                                ]}
                                onPress={() => setThemeAndClose("dark")}
                            >
                                <Ionicons name="moon-outline" size={24} color={themeType === "dark" ? "#fff" : theme.text} />
                                <Text style={[
                                    styles(theme).modalBtnText,
                                    themeType === "dark" && { color: "#fff" }
                                ]}>Dark</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles(theme).modalClose} onPress={() => setShowThemeModal(false)}>
                            <Text style={[
                                styles(theme).modalCloseText,
                                themeType === "dark" && { color: "#fff" }
                            ]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function SettingRow({
    label,
    value,
    onValueChange,
    theme,
    isTheme,
}: {
    label: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
    theme: any;
    isTheme?: boolean;
}) {
    return (
        <View style={settingRowStyles.row}>
            <Text style={[settingRowStyles.label, { color: theme.text }]}>{label}</Text>
            {isTheme ? (
                <TouchableOpacity
                    onPress={() => onValueChange(!value)}
                    style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                >
                    <Ionicons
                        name={value ? "moon" : "sunny"}
                        size={28}
                        color={theme.primary}
                    />
                </TouchableOpacity>
            ) : (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: theme.secondary, true: theme.primary }}
                    thumbColor={value ? theme.card : "#f4f3f4"}
                />
            )}
        </View>
    );
}

function SocialButton({
    icon,
    onPress,
    theme,
}: {
    icon: React.ReactNode;
    onPress: () => void;
    theme: any;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles(theme).socialBtn]}
            accessibilityLabel="Connect"
        >
            {icon}
        </TouchableOpacity>
    );
}

const settingRowStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingHorizontal: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
    },
});

const styles = (theme: any) =>
    StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: theme.background,
            alignItems: "center",
            paddingTop: Platform.OS === "ios" ? 60 : 36,
        },
        header: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            paddingHorizontal: 20,
        },
        circleButton: {
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: theme.card,
            alignItems: "center",
            justifyContent: "center",
        },
        logo: {
            flex: 1,
            textAlign: "center",
            color: theme.text,
            fontSize: 28,
            fontFamily: "Pacifico"
        },
        contentContainer: {
            width: "100%",
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: 64,
            alignItems: "center",
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: theme.primary,
            marginTop: 18,
            marginBottom: 4,
            alignSelf: "center",
        },
        aboutBox: {
            marginTop: 12,
            padding: 16,
            borderRadius: 14,
            backgroundColor: theme.card,
            alignItems: "center",
            justifyContent: "center",
        },
        aboutText: {
            color: theme.textSecondary,
            fontSize: 14,
            marginBottom: 2,
            textAlign: "center",
        },
        // Modal styles
        modalOverlay: {
            flex: 1,
            backgroundColor: "#0007",
            alignItems: "center",
            justifyContent: "center",
        },
        modalBox: {
            backgroundColor: theme.card,
            borderRadius: 20,
            padding: 22,
            width: 270,
            alignItems: "center",
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.13,
            shadowRadius: 12,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 22,
            textAlign: "center",
        },
        modalBtns: {
            flexDirection: "row",
            gap: 18,
            marginBottom: 18,
            justifyContent: "center",
            alignItems: "center",
        },
        modalBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.background,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 16,
            minWidth: 80,
            borderWidth: 1,
            borderColor: theme.secondary,
            marginHorizontal: 4,
        },
        modalBtnSelected: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        modalBtnText: {
            fontSize: 15,
            color: theme.text,
            fontWeight: "700",
            marginLeft: 7,
        },
        modalBtnTextSelected: {
            color: theme.buttonText || "#fff",
        },
        modalClose: {
            marginTop: 6,
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 8,
            backgroundColor: theme.secondary,
        },
        modalCloseText: {
            color: theme.text,
            fontWeight: "600",
            fontSize: 16,
            textAlign: "center",
        },
        socialRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            marginVertical: 16,
            width: "90%",
            gap: 0,
        },
        socialBtn: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.card,
            borderRadius: 20,
            padding: 18,
            marginHorizontal: 8,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.10,
            shadowRadius: 8,
        },
    });