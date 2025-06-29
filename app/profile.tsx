import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    TextInput,
    Modal,
    Pressable,
    ScrollView,
    Image,
    KeyboardAvoidingView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useThemeContext } from "./context/ThemeContext";

type PersonalData = {
    name?: string;
    username?: string;
    birthday?: string;
    gender?: string;
    bio?: string;
    religion?: string;
    mood?: string;
    lifeAspect?: string;
    theme?: string;
    frequency?: string;
    imageUri?: string;
};

const getUserPersonalData = async (): Promise<PersonalData | null> => {
    const raw = await AsyncStorage.getItem("userPersonalData");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const saveUserPersonalData = async (data: PersonalData) => {
    const raw = await AsyncStorage.getItem("userPersonalData");
    let oldData = {};
    if (raw) {
        try {
            oldData = JSON.parse(raw);
        } catch { }
    }
    await AsyncStorage.setItem("userPersonalData", JSON.stringify({ ...oldData, ...data }));
};

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useThemeContext();

    const [personalData, setPersonalData] = useState<PersonalData>({
        name: "",
        username: "",
        birthday: "",
        gender: "",
        bio: "",
        religion: "",
        mood: "",
        lifeAspect: "",
        theme: "",
        frequency: "",
        imageUri: "",
    });

    const [editValues, setEditValues] = useState<PersonalData>({ ...personalData });
    const [modalVisible, setModalVisible] = useState(false);

    // Success modal for "Profile updated!"
    const [successModal, setSuccessModal] = useState(false);

    useEffect(() => {
        getUserPersonalData().then(data => {
            if (data) {
                setPersonalData(data);
                setEditValues(data);
            }
        });
    }, [modalVisible, successModal]);

    const handleEditPress = () => {
        setEditValues(personalData);
        setModalVisible(true);
    };

    const handleSave = async () => {
        await saveUserPersonalData(editValues);
        setPersonalData(editValues);
        setModalVisible(false);
        setSuccessModal(true);
        setTimeout(() => setSuccessModal(false), 1300);
    };

    const formatBirthday = (dateStr?: string) => {
        if (!dateStr) return "-";
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
        }
        return dateStr;
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Please allow access to your media library to select a profile picture.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setEditValues(ev => ({
                ...ev,
                imageUri: result.assets[0].uri,
            }));
        }
    };

    return (
        <View style={styles(theme).mainContainer}>
            {/* Header */}
            <View style={styles(theme).header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles(theme).circleButton}
                    accessibilityLabel="Back"
                >
                    <Ionicons name="arrow-back-outline" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles(theme).logo, { color: theme.text, fontFamily: "Pacifico" }]}>Profile</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles(theme).contentContainer}>
                {/* Avatar with Edit Button */}
                <View style={styles(theme).avatarSection}>
                    <View style={styles(theme).avatarWrapper}>
                        {personalData.imageUri ? (
                            <Image
                                source={{ uri: personalData.imageUri }}
                                style={styles(theme).avatarImg}
                            />
                        ) : (
                            <Ionicons name="person-circle" size={110} color={theme.primary} />
                        )}
                        <TouchableOpacity
                            style={styles(theme).editIcon}
                            onPress={handleEditPress}
                            accessibilityLabel="Edit Profile"
                        >
                            <Feather name="edit-3" size={22} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles(theme).nameText}>{personalData.name || "-"}</Text>
                    <Text style={styles(theme).usernameText}>@{personalData.username || "-"}</Text>
                </View>

                {/* Info Row: Birthday & Gender */}
                <View style={styles(theme).infoRowContainer}>
                    <View style={styles(theme).infoItem}>
                        <Text style={styles(theme).infoLabel}>Birthday</Text>
                        <Text style={styles(theme).infoValue}>{formatBirthday(personalData.birthday)}</Text>
                    </View>
                    <View style={styles(theme).divider} />
                    <View style={styles(theme).infoItem}>
                        <Text style={styles(theme).infoLabel}>Gender</Text>
                        <Text style={styles(theme).infoValue}>{personalData.gender || "-"}</Text>
                    </View>
                </View>

                <View style={styles(theme).infoItem}>
                    <Text style={styles(theme).infoLabel}>Bio</Text>
                    <Text style={styles(theme).infoValue}>{personalData.bio || "-"}</Text>
                </View>

                {/* Additional Info: Bio, Religion, Mood, Life Aspect, Theme, Frequency */}
                <View style={styles(theme).fullInfoBox}>
                    <InfoRow label="Religion" value={personalData.religion} theme={theme} />
                    <InfoRow label="Mood" value={personalData.mood} theme={theme} />
                    <InfoRow label="Life Aspect" value={personalData.lifeAspect} theme={theme} />
                    <InfoRow label="Theme" value={personalData.theme} theme={theme} />
                    <InfoRow label="Frequency" value={personalData.frequency} theme={theme} />
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    style={styles(theme).editProfileBtn}
                    onPress={handleEditPress}
                    accessibilityLabel="Edit Profile"
                >
                    <Text style={styles(theme).editProfileBtnText}>Edit Profile</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles(theme).modalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles(theme).modalContent}>
                        <ScrollView
                            contentContainerStyle={styles(theme).modalScrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles(theme).editTitle}>Edit Profile</Text>
                            <TouchableOpacity style={styles(theme).modalAvatarEdit} onPress={pickImage}>
                                {editValues.imageUri ? (
                                    <Image source={{ uri: editValues.imageUri }} style={styles(theme).modalAvatarImg} />
                                ) : (
                                    <Ionicons name="person-circle" size={80} color={theme.primary} />
                                )}
                                <View style={styles(theme).modalAvatarEditIcon}>
                                    <Feather name="edit-3" size={18} color={theme.text} />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles(theme).inputLabel}>Name</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.name}
                                onChangeText={v => setEditValues(ev => ({ ...ev, name: v }))}
                                placeholder="Enter your name"
                                placeholderTextColor={theme.textSecondary}
                            />
                            <Text style={styles(theme).inputLabel}>Username</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.username}
                                onChangeText={v => setEditValues(ev => ({ ...ev, username: v }))}
                                placeholder="Enter your username"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                            <Text style={styles(theme).inputLabel}>Birthday (YYYY-MM-DD)</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.birthday}
                                onChangeText={v => setEditValues(ev => ({ ...ev, birthday: v }))}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                                keyboardType="numbers-and-punctuation"
                            />
                            <Text style={styles(theme).inputLabel}>Gender</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.gender}
                                onChangeText={v => setEditValues(ev => ({ ...ev, gender: v }))}
                                placeholder="Male / Female / Other"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                            <Text style={styles(theme).inputLabel}>Bio</Text>
                            <TextInput
                                style={[styles(theme).input, { minHeight: 48 }]}
                                value={editValues.bio}
                                onChangeText={v => setEditValues(ev => ({ ...ev, bio: v }))}
                                placeholder="Tell us about yourself"
                                placeholderTextColor={theme.textSecondary}
                                multiline
                            />
                            <Text style={styles(theme).inputLabel}>Religion</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.religion}
                                onChangeText={v => setEditValues(ev => ({ ...ev, religion: v }))}
                                placeholder="Your religion"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                            <Text style={styles(theme).inputLabel}>Mood</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.mood}
                                onChangeText={v => setEditValues(ev => ({ ...ev, mood: v }))}
                                placeholder="How do you feel?"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                            <Text style={styles(theme).inputLabel}>Life Aspect</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.lifeAspect}
                                onChangeText={v => setEditValues(ev => ({ ...ev, lifeAspect: v }))}
                                placeholder="Important aspect of your life"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                            <Text style={styles(theme).inputLabel}>Theme</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.theme}
                                onChangeText={v => setEditValues(ev => ({ ...ev, theme: v }))}
                                placeholder="Theme preference"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                            <Text style={styles(theme).inputLabel}>Frequency</Text>
                            <TextInput
                                style={styles(theme).input}
                                value={editValues.frequency}
                                onChangeText={v => setEditValues(ev => ({ ...ev, frequency: v }))}
                                placeholder="App usage frequency"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />

                            <View style={styles(theme).modalButtonRow}>
                                <Pressable
                                    style={styles(theme).modalCancelBtn}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles(theme).modalCancelText}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={styles(theme).modalSaveBtn}
                                    onPress={handleSave}
                                >
                                    <Text style={styles(theme).modalSaveText}>Save</Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={successModal}
                onRequestClose={() => setSuccessModal(false)}
            >
                <View style={styles(theme).modalOverlay}>
                    <View style={styles(theme).successModalContent}>
                        <Ionicons name="checkmark-circle" size={48} color={theme.primary} style={{ marginBottom: 8 }} />
                        <Text style={styles(theme).successText}>Profile updated!</Text>
                        <Text style={styles(theme).successSubText}>Your profile information was saved.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function InfoRow({ label, value, theme }: { label: string; value?: string; theme: any }) {
    if (!value) return null;
    return (
        <View style={infoRowStyles.infoRow}>
            <Text style={[infoRowStyles.label, { color: theme.textSecondary }]}>{label}</Text>
            <Text style={[infoRowStyles.value, { color: theme.text }]}>{value}</Text>
        </View>
    );
}

const infoRowStyles = StyleSheet.create({
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
    },
    value: {
        fontSize: 14,
        fontWeight: "400",
        flexShrink: 1,
        textAlign: "right",
    },
});

const styles = (theme: ReturnType<typeof import("./personalize/theme").getTheme>) =>
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
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 60,
            paddingHorizontal: 28,
            width: "100%",
        },
        avatarSection: {
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
        },
        avatarWrapper: {
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
        },
        avatarImg: {
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: theme.card,
            borderWidth: 2,
            borderColor: theme.primary,
        },
        editIcon: {
            position: "absolute",
            bottom: 10,
            right: 0,
            backgroundColor: theme.primary,
            borderRadius: 999,
            padding: 8,
            borderWidth: 2,
            borderColor: theme.background,
            elevation: 2,
            zIndex: 2,
        },
        nameText: {
            fontSize: 22,
            fontWeight: "700",
            color: theme.text,
            marginTop: 10,
            textAlign: "center",
        },
        usernameText: {
            fontSize: 16,
            color: theme.textSecondary,
            marginBottom: 18,
            textAlign: "center",
        },
        infoRowContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            marginTop: 10,
            width: "80%",
        },
        infoItem: {
            flex: 1,
            alignItems: "center",
        },
        infoLabel: {
            fontSize: 13,
            color: theme.textSecondary,
            marginBottom: 2,
        },
        infoValue: {
            fontSize: 16,
            color: theme.text,
            fontWeight: "500",
        },
        divider: {
            width: 1,
            backgroundColor: theme.secondary,
            height: 38,
            marginHorizontal: 8,
            alignSelf: "center",
        },
        fullInfoBox: {
            width: "100%",
            backgroundColor: theme.card,
            borderRadius: 18,
            padding: 16,
            marginTop: 10,
            marginBottom: 18,
        },
        editProfileBtn: {
            marginTop: 30,
            backgroundColor: theme.primary,
            borderRadius: 22,
            paddingHorizontal: 30,
            paddingVertical: 13,
            alignSelf: "center",
            marginBottom: 18,
            minWidth: 170,
        },
        editProfileBtnText: {
            color: theme.buttonText || "#222",
            fontWeight: "700",
            fontSize: 16,
            textAlign: "center",
        },
        // Modal styles
        modalOverlay: {
            flex: 1,
            backgroundColor: "#0006",
            justifyContent: "center",
            alignItems: "center",
        },
        modalContent: {
            width: 340,
            maxHeight: 540,
            backgroundColor: theme.card,
            borderRadius: 22,
            padding: 20,
            alignItems: "stretch",
            shadowColor: "#000",
            shadowOpacity: 0.10,
            shadowRadius: 8,
            elevation: 4,
        },
        modalScrollContent: {
            paddingBottom: 8,
        },
        modalAvatarEdit: {
            alignSelf: "center",
            marginBottom: 14,
        },
        modalAvatarImg: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.card,
            borderWidth: 2,
            borderColor: theme.primary,
        },
        modalAvatarEditIcon: {
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: theme.primary,
            borderRadius: 12,
            padding: 4,
            borderWidth: 2,
            borderColor: theme.card,
        },
        editTitle: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            color: theme.text,
            textAlign: "center",
        },
        inputLabel: {
            fontSize: 14,
            color: theme.textSecondary,
            marginTop: 8,
            marginBottom: 1,
        },
        input: {
            backgroundColor: theme.background,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 16,
            color: theme.text,
            marginBottom: 0,
            borderWidth: 1,
            borderColor: theme.secondary,
        },
        modalButtonRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            gap: 14,
            marginBottom: 12,
        },
        modalCancelBtn: {
            flex: 1,
            backgroundColor: theme.secondary,
            borderRadius: 10,
            alignItems: "center",
            padding: 10,
            marginRight: 6,
        },
        modalSaveBtn: {
            flex: 1,
            backgroundColor: theme.primary,
            borderRadius: 10,
            alignItems: "center",
            padding: 10,
            marginLeft: 6,
        },
        modalCancelText: {
            color: theme.text,
            fontWeight: "600",
            fontSize: 15,
        },
        modalSaveText: {
            color: theme.buttonText || "#222",
            fontWeight: "700",
            fontSize: 15,
        },
        // Success modal
        successModalContent: {
            backgroundColor: theme.card,
            borderRadius: 18,
            padding: 32,
            alignItems: "center",
            justifyContent: "center",
            minWidth: 220,
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 10,
        },
        successText: {
            fontSize: 19,
            fontWeight: "700",
            color: theme.text,
            textAlign: "center",
        },
        successSubText: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: "center",
            marginTop: 6,
        },
    });