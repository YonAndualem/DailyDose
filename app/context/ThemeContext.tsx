import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeType, getTheme } from "../personalize/theme";

type ThemeContextType = {
    themeType: ThemeType;
    setThemeType: (t: ThemeType) => void;
    theme: ReturnType<typeof getTheme>;
    initialized: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
    themeType: "light",
    setThemeType: () => { },
    theme: getTheme("light"),
    initialized: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeType, setThemeTypeState] = useState<ThemeType>("light");
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("userTheme").then(st => {
            if (st === "dark" || st === "light") setThemeTypeState(st);
            setInitialized(true);
        });
    }, []);

    const setThemeType = (t: ThemeType) => {
        setThemeTypeState(t);
        AsyncStorage.setItem("userTheme", t);
    };

    return (
        <ThemeContext.Provider value={{ themeType, setThemeType, theme: getTheme(themeType), initialized }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useThemeContext() {
    return useContext(ThemeContext);
}

export default ThemeProvider;