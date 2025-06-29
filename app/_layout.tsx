import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true, // NEW
        shouldShowList: true,   // NEW
    }),
});

export default function RootLayout() {
    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Enable notifications in your settings for DailyDose to send daily quotes!");
            }
        })();
    }, []);

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerShown: false, // This hides the header globally
                }}
            />
        </ThemeProvider>
    );
}