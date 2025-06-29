import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserPersonalData = {
    name: string;
    username: string;
    birthday: string;
    religion: string;
    mood: string;
    lifeAspect: string;
    theme: string;
    frequency: string;
};

export async function getUserPersonalData(): Promise<UserPersonalData | null> {
    const raw = await AsyncStorage.getItem("userPersonalData");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}