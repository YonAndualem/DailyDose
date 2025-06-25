import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Daily Dose" }} />
            <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
        </Stack>
    );
}