import { Stack } from "expo-router";
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
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