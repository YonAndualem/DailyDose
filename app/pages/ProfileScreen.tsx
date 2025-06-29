import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { getTheme, ThemeType } from "../personalize/theme";

// Dummy props for demonstration. Replace with real data/hooks.
type ProfileScreenProps = {
    theme: ThemeType; // "light" | "dark" | "gradient"
    profile: {
        name: string;
        username: string;
        birthday: string;
        gender: string;
        bio: string;
        email: string;
        password: string;
        onEditAvatar: () => void;
        onEdit: () => void;
        onLogout: () => void;
        onDelete: () => void;
    };
};

export default function ProfileScreen({ theme, profile }: ProfileScreenProps) {
    const t = getTheme(theme);

    return (
        <View style={[styles.container, { backgroundColor: t.background }]}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton}>
                <Text style={[styles.arrow, { color: t.textSecondary }]}>←</Text>
            </TouchableOpacity>
            {/* Title */}
            <Text style={[styles.title, { color: t.text, fontFamily: "Pacifico" }]}>Quotoday</Text>
            {/* Avatar and edit */}
            <View style={styles.avatarWrapper}>
                <View style={[styles.avatar, { backgroundColor: t.secondary }]}>
                    {/* Replace with actual user image if available */}
                    <Image source={require("../../assets/images/onboarding/onboarding1.png")} style={styles.avatarImg} />
                </View>
                <TouchableOpacity style={[styles.editIcon, { backgroundColor: "#D8FF3A" }]} onPress={profile.onEditAvatar}>
                    <Text style={styles.editIconText}>✎</Text>
                </TouchableOpacity>
            </View>
            {/* Name and username */}
            <Text style={[styles.profileName, { color: t.text }]}>{profile.name}</Text>
            <Text style={[styles.profileUsername, { color: t.textSecondary }]}>{profile.username}</Text>
            {/* Edit Profile button */}
            <TouchableOpacity
                style={[styles.editProfileButton, { backgroundColor: "#D8FF3A" }]}
                onPress={profile.onEdit}
            >
                <Text style={[styles.editProfileText, { color: "#111" }]}>Edit Profile</Text>
            </TouchableOpacity>
            {/* Birthday / Gender */}
            <View style={styles.row}>
                <Text style={[styles.infoText, { color: t.textSecondary }]}>
                    Birthday{"\n"}
                    <Text style={styles.infoMain}>{profile.birthday}</Text>
                </Text>
                <View style={styles.divider} />
                <Text style={[styles.infoText, { color: t.textSecondary }]}>
                    Gender{"\n"}
                    <Text style={styles.infoMain}>{profile.gender}</Text>
                </Text>
            </View>
            {/* Bio */}
            <TextInput
                style={[styles.input, { color: t.text, borderColor: t.border }]}
                placeholder="Bio (this will be shown to public)"
                placeholderTextColor={t.textSecondary}
                value={profile.bio}
                editable
                multiline
            />
            {/* Email / Phone */}
            <TextInput
                style={[styles.input, { color: t.text, borderColor: t.border }]}
                placeholder="Email / Phone number"
                placeholderTextColor={t.textSecondary}
                value={profile.email}
                editable
            />
            {/* Password */}
            <TextInput
                style={[styles.input, { color: t.text, borderColor: t.border }]}
                placeholder="Password"
                placeholderTextColor={t.textSecondary}
                value={profile.password}
                secureTextEntry
                editable
            />
            {/* Log out / Delete */}
            <TouchableOpacity style={[styles.logoutButton, { borderColor: t.border }]} onPress={profile.onLogout}>
                <Text style={{ color: t.text }}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={profile.onDelete}>
                <Text style={{ color: t.textSecondary }}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", paddingTop: 48 },
    backButton: { position: "absolute", top: 30, left: 18, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "#ededed33", justifyContent: "center", alignItems: "center" },
    arrow: { fontSize: 22 },
    title: { fontSize: 32, fontWeight: "400", marginTop: 8, marginBottom: 10, textAlign: "center" },
    avatarWrapper: { marginTop: 10, marginBottom: 14 },
    avatar: { width: 110, height: 110, borderRadius: 55, justifyContent: "center", alignItems: "center" },
    avatarImg: { width: 90, height: 90, borderRadius: 45 },
    editIcon: { position: "absolute", right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
    editIconText: { fontSize: 18, color: "#333" },
    profileName: { fontWeight: "bold", fontSize: 22, marginTop: 8 },
    profileUsername: { fontSize: 16, marginBottom: 12 },
    editProfileButton: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 50, marginBottom: 18 },
    editProfileText: { fontWeight: "bold", fontSize: 17 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 18 },
    infoText: { fontSize: 13, textAlign: "center" },
    infoMain: { fontWeight: "bold", fontSize: 16, color: "#111" },
    divider: { width: 1, height: 30, backgroundColor: "#ccc", marginHorizontal: 22 },
    input: { width: 310, height: 46, marginVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderRadius: 22, fontSize: 16, backgroundColor: "#fff" },
    logoutButton: { width: 140, height: 40, borderWidth: 1, borderRadius: 22, justifyContent: "center", alignItems: "center", marginTop: 22, marginBottom: 6, backgroundColor: "#f5f5f5" },
    deleteButton: { marginTop: 4 },
});