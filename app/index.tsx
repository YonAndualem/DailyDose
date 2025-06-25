import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, ActivityIndicator, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const [showBlue, setShowBlue] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const [fontsLoaded] = useFonts({ Pacifico: Pacifico_400Regular });
    const [checkedOnboarding, setCheckedOnboarding] = useState(false);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

    const { height } = Dimensions.get("window");

    // On mount, check if onboarding has been seen
    useEffect(() => {
        AsyncStorage.getItem("hasSeenOnboarding")
            .then(val => {
                setHasSeenOnboarding(val === "true");
                setCheckedOnboarding(true);
            });
    }, []);

    // Splash animation and redirect logic
    useEffect(() => {
        if (!fontsLoaded || !checkedOnboarding) return;

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false,
            delay: 1500,
        }).start(() => setShowBlue(true));

        const timer = setTimeout(() => {
            if (!hasSeenOnboarding) {
                router.replace("/onboarding");
            } else {
                router.replace("/home");
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [fontsLoaded, checkedOnboarding, hasSeenOnboarding]);

    if (!fontsLoaded || !checkedOnboarding) return null;

    return (
        <View style={{ flex: 1 }}>
            {/* Screen 1: Black */}
            <View style={[styles.screen, { backgroundColor: "#191919", zIndex: showBlue ? 0 : 2 }]}>
                <Text style={[styles.title, { fontFamily: "Pacifico" }]}>
                    DailyDose
                </Text>
            </View>
            {/* Screen 2: Blue, fade in */}
            <Animated.View
                style={[
                    styles.screen,
                    {
                        backgroundColor: "#1C274C",
                        opacity: fadeAnim,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: showBlue ? 2 : 1,
                    },
                ]}
            >
                <Text style={[styles.title, { fontFamily: "Pacifico" }]}>
                    DailyDose
                </Text>
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: height * 0.38 }} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 54,
        color: "#fff",
        textAlign: "center",
        letterSpacing: 1.5,
        marginBottom: 8,
    },
});