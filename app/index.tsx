import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, ActivityIndicator, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";

export default function Index() {
    const [showBlue, setShowBlue] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const [fontsLoaded] = useFonts({ Pacifico: Pacifico_400Regular });
    const [checkedFlags, setCheckedFlags] = useState(false);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
    const [hasCompletedPersonalize, setHasCompletedPersonalize] = useState<boolean | null>(null);

    const { height } = Dimensions.get("window");

    useEffect(() => {
        // Check both onboarding and personal data flags
        (async () => {
            const seenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
            const completedPersonalize = await AsyncStorage.getItem("hasCompletedPersonalize");
            setHasSeenOnboarding(seenOnboarding === "true");
            setHasCompletedPersonalize(completedPersonalize === "true");
            setCheckedFlags(true);
        })();
    }, []);

    useEffect(() => {
        if (!fontsLoaded || !checkedFlags) return;

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false,
            delay: 1500,
        }).start(() => setShowBlue(true));

        const timer = setTimeout(() => {
            if (!hasSeenOnboarding) {
                router.replace("/onboarding");
            } else if (!hasCompletedPersonalize) {
                router.replace("/personalize");
            } else {
                router.replace("/home");
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [fontsLoaded, checkedFlags, hasSeenOnboarding, hasCompletedPersonalize]);

    if (!fontsLoaded || !checkedFlags) return null;

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