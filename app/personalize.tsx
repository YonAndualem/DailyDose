import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";

// Step components (each has its own styles internally)
import WelcomeStep from "./personalize/WelcomeStep";
import NameStep from "./personalize/NameStep";
import UsernameStep from "./personalize/UsernameStep";
import StepBirthday from "./personalize/BirthdayStep";
import ReligionStep from "./personalize/ReligionStep";
import MoodStep from "./personalize/MoodStep";
import LifeAspectStep from "./personalize/LifeAspectStep";
import ThemeStep from "./personalize/ThemeStep";
import FrequencyStep from "./personalize/FrequencyStep";
import SummaryStep from "./personalize/SummaryStep";

export default function PersonalizeScreen() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({ Pacifico: Pacifico_400Regular });

    // Wizard state
    const [step, setStep] = useState(0);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [birthday, setBirthday] = useState("");
    const [religion, setReligion] = useState("");
    const [mood, setMood] = useState("");
    const [lifeAspect, setLifeAspect] = useState("");
    const [theme, setTheme] = useState("");
    const [frequency, setFrequency] = useState("");

    if (!fontsLoaded) return null;

    // Steps array: each step is a component, passing state as needed
    const steps = [
        <WelcomeStep onNext={() => setStep(step + 1)} key={0} />,
        <NameStep
            value={name}
            onChange={setName}
            onNext={() => setStep(step + 1)}
            onPrev={step > 0 ? () => setStep(step - 1) : undefined}
            key={1}
        />,
        <UsernameStep
            value={username}
            onChange={setUsername}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={2}
        />,
        <StepBirthday
            value={birthday}
            onChange={setBirthday}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={3}
        />,
        <ReligionStep
            value={religion}
            onChange={setReligion}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={4}
        />,
        <MoodStep
            value={mood}
            onChange={setMood}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={5}
        />,
        <LifeAspectStep
            value={lifeAspect}
            onChange={setLifeAspect}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={6}
        />,
        <ThemeStep
            value={theme}
            onChange={setTheme}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={7}
        />,
        <FrequencyStep
            value={frequency}
            onChange={setFrequency}
            onNext={() => setStep(step + 1)}
            onPrev={() => setStep(step - 1)}
            key={8}
        />,
        <SummaryStep
            data={{ name, username, birthday, religion, mood, lifeAspect, theme, frequency }}
            onFinish={async () => {
                // Save data and flag as done
                await AsyncStorage.setItem("hasCompletedPersonalize", "true");
                await AsyncStorage.setItem(
                    "userPersonalData",
                    JSON.stringify({ name, username, birthday, religion, mood, lifeAspect, theme, frequency })
                );
                router.replace("/home");
            }}
            onPrev={() => setStep(step - 1)}
            key={9}
        />,
    ];

    return <View style={styles.container}>{steps[step]}</View>;
}

// Only global container style, all step-specific styles are in component files
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161F35",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
});