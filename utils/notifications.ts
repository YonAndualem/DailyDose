import * as Notifications from "expo-notifications";
import { getQuoteOfTheDay, Quote } from "../utils/api";

/**
 * Schedules a local notification for the daily quote at a fixed time (e.g., 8:00 AM).
 * If a notification is already scheduled, it cancels previous schedules.
 * Uses Quote of the Day API, and falls back if API fails.
 */
export async function scheduleDailyQuoteNotification() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    let quoteObj: Quote | null = null;
    try {
        quoteObj = await getQuoteOfTheDay();
    } catch (err) {
        // fallback if API fails
        quoteObj = {
            id: 0,
            quote: "Stay positive and keep going!",
            author: "DailyDose",
        };
    }

    // Defensive: never allow undefined in notification
    const quote = quoteObj.quote || "Stay positive and keep going!";
    const author = quoteObj.author || "DailyDose";

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "DailyDose Today",
            body: `"${quote}"\n ${author}`,
            data: { type: "daily-quote" },
        },
        trigger: {
            hour: 8,
            minute: 0,
            repeats: true,
        },
    });
}

/**
 * Cancels all scheduled local notifications for daily quotes.
 */
export async function cancelDailyQuoteNotification() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}