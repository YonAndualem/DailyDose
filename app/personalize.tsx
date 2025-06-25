import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import StepBirthday from "./personalize/BirthdayStep";
import WelcomeStep from "./personalize/WelcomeStep";


// Example options for religion, feelings, etc.
const religions = ["None", "Christianity", "Islam", "Judaism", "Other"];
const moods = ["Happy", "Sad", "Excited", "Anxious", "Calm"];
const lifeAspects = ["Self-love", "Relationships", "Career", "Health", "Spirituality"];
const quoteThemes = [
    { key: "dark", label: "Dark", preview: require("../assets/images/onboarding/onboarding1.png") },
    { key: "light", label: "Light", preview: require("../assets/images/onboarding/onboarding1.png") },
    { key: "gradient", label: "Gradient", preview: require("../assets/images/onboarding/onboarding1.png") },
    // Add your own themes and previews here
];
const frequencies = ["Daily", "Weekly", "Monthly"];

const { width } = Dimensions.get("window");

// STEP COMPONENTS



function StepName({ value, onChange, onNext }: { value: string, onChange: (v: string) => void, onNext: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
                placeholder="Type your name"
                placeholderTextColor="#888"
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
            />
            <Text style={styles.explainingText}>Your name will be displayed in your motivational quotes.</Text>
            <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

function StepUsername({ value, onChange, onNext, onPrev }: { value: string, onChange: (v: string) => void, onNext: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>Set your username</Text>
            <TextInput
                placeholder="Choose a username"
                placeholderTextColor="#888"
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
            />
            <Text style={styles.explainingText}>Your username will be displayed when you post something.
            You can edit it later.</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


function StepReligion({ value, onChange, onNext, onPrev }: { value: string, onChange: (v: string) => void, onNext: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>Select your religion (optional)</Text>
            {religions.map((r) => (
                <TouchableOpacity
                    key={r}
                    style={[styles.optionButton, value === r && styles.optionButtonSelected]}
                    onPress={() => onChange(r)}
                >
                    <Text style={[styles.optionText, value === r && styles.optionTextSelected]}>{r}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function StepMood({ value, onChange, onNext, onPrev }: { value: string, onChange: (v: string) => void, onNext: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>How are you feeling right now?</Text>
            {moods.map((m) => (
                <TouchableOpacity
                    key={m}
                    style={[styles.optionButton, value === m && styles.optionButtonSelected]}
                    onPress={() => onChange(m)}
                >
                    <Text style={[styles.optionText, value === m && styles.optionTextSelected]}>{m}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function StepLifeAspect({ value, onChange, onNext, onPrev }: { value: string, onChange: (v: string) => void, onNext: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>What aspect of life do you want to improve?</Text>
            {lifeAspects.map((aspect) => (
                <TouchableOpacity
                    key={aspect}
                    style={[styles.optionButton, value === aspect && styles.optionButtonSelected]}
                    onPress={() => onChange(aspect)}
                >
                    <Text style={[styles.optionText, value === aspect && styles.optionTextSelected]}>{aspect}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function StepTheme({ value, onChange, onNext, onPrev }: { value: string, onChange: (v: string) => void, onNext: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>Choose your quotes main theme</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
                {quoteThemes.map((theme) => (
                    <TouchableOpacity
                        key={theme.key}
                        style={[styles.themeButton, value === theme.key && styles.themeButtonSelected]}
                        onPress={() => onChange(theme.key)}
                    >
                        <Image source={theme.preview} style={styles.themePreview} />
                        <Text style={[styles.themeText, value === theme.key && styles.themeTextSelected]}>{theme.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function StepFrequency({ value, onChange, onNext, onPrev }: { value: string, onChange: (v: string) => void, onNext: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>How often do you want to receive quotes?</Text>
            {frequencies.map((freq) => (
                <TouchableOpacity
                    key={freq}
                    style={[styles.optionButton, value === freq && styles.optionButtonSelected]}
                    onPress={() => onChange(freq)}
                >
                    <Text style={[styles.optionText, value === freq && styles.optionTextSelected]}>{freq}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNext} disabled={!value}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function StepSummary({ data, onFinish, onPrev }: { data: any, onFinish: () => void, onPrev: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>DailyDose</Text>
            <Text style={styles.label}>All set, {data.name || "friend"}!</Text>
            <Text style={styles.summaryText}>Welcome to DailyDose. Embrace your journey to happiness!</Text>
            <TouchableOpacity style={styles.button} onPress={onFinish}>
                <Text style={styles.buttonText}>Go to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
                <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

// MAIN WIZARD COMPONENT

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

    const steps = [
        <WelcomeStep onNext={() => setStep(step + 1)} key={0} />,
        <StepName value={name} onChange={setName} onNext={() => setStep(step + 1)} key={1} />,
        <StepUsername value={username} onChange={setUsername} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={2} />,
        <StepBirthday value={birthday} onChange={setBirthday} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={3} />,
        <StepReligion value={religion} onChange={setReligion} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={4} />,
        <StepMood value={mood} onChange={setMood} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={5} />,
        <StepLifeAspect value={lifeAspect} onChange={setLifeAspect} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={6} />,
        <StepTheme value={theme} onChange={setTheme} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={7} />,
        <StepFrequency value={frequency} onChange={setFrequency} onNext={() => setStep(step + 1)} onPrev={() => setStep(step - 1)} key={8} />,
        <StepSummary
            data={{ name, username, birthday, religion, mood, lifeAspect, theme, frequency }}
            onFinish={async () => {
                // Save data and flag as done
                await AsyncStorage.setItem("hasCompletedPersonalize", "true");
                await AsyncStorage.setItem("userPersonalData", JSON.stringify({ name, username, birthday, religion, mood, lifeAspect, theme, frequency }));
                router.replace("/home");
            }}
            onPrev={() => setStep(step - 1)}
            key={9}
        />,
    ];

    return <View style={styles.container}>{steps[step]}</View>;
}

// THEME STYLES
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161F35", // your theme background
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    stepContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
    },
    logo: {
        fontSize: 42,
        color: "#fff",
        marginBottom: 18,
        textAlign: "center",
        // fontFamily applied inline
    },
    label: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 14,
        textAlign: "center",
    },
    textInput: {
        width: "85%",
        height: 48,
        borderRadius: 12,
        backgroundColor: "#232B45",
        color: "#fff",
        paddingHorizontal: 16,
        fontSize: 17,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: "#30395c",
        textAlign: "center",
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
    optionButton: {
        backgroundColor: "#232B45",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 30,
        marginVertical: 7,
        minWidth: 180,
        borderWidth: 1,
        borderColor: "#30395c",
    },
    optionButtonSelected: {
        backgroundColor: "#9147FF",
        borderColor: "#9147FF",
    },
    optionText: {
        color: "#bbb",
        fontSize: 16,
        textAlign: "center",
    },
    optionTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    themeButton: {
        backgroundColor: "#232B45",
        borderRadius: 10,
        margin: 4,
        borderWidth: 2,
        borderColor: "#232B45",
        alignItems: "center",
        width: 90,
        height: 100,
        justifyContent: "center",
    },
    themeButtonSelected: {
        borderColor: "#9147FF",
        backgroundColor: "#3a255b"
    },
    themePreview: {
        width: 70,
        height: 40,
        borderRadius: 6,
        marginBottom: 6,
        backgroundColor: "#222",
    },
    themeText: {
        color: "#bbb",
        fontSize: 14,
    },
    themeTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    welcomeTitle: {
        fontSize: 26,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    welcomeText: {
        fontSize: 16,
        color: "#bbb",
        marginBottom: 5,
        textAlign: "center",
        paddingHorizontal: 8,
    },
    welcomeText2: {
        fontSize: 16,
        color: "#bbb",
        marginBottom: 28,
        textAlign: "center",
        paddingHorizontal: 8,
    },
    explainingText: {
        fontSize: 12,
        color: "#bbb",
        marginBottom: 28,
        textAlign: "center",
        paddingHorizontal: 8,
    },
    summaryText: {
        color: "#bbb",
        fontSize: 16,
        marginVertical: 18,
        textAlign: "center",
        paddingHorizontal: 10,
    },
});