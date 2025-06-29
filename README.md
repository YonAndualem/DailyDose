# DailyDose

**DailyDose** is a motivational quote app built with [Expo](https://expo.dev/) and React Native. It delivers an inspiring quote every day, allows users to browse and save their favorite quotes, and sends daily notifications with a new quote of the day (QOTD).

---

## ✨ Features

- **Quote of the Day**: Get a fresh, motivational quote every morning via notification.
- **Browse Quotes**: Explore quotes by category, author, or at random.
- **Favorites**: Save your favorite quotes locally for quick access.
- **Daily Notifications**: Receive a daily notification at your chosen time with the QOTD.
- **Beautiful UI**: Clean, simple, and responsive design.
- **Offline Support**: Previously loaded quotes and favorites are available offline.
- **Dark Mode**: Supports both light and dark themes.

---

## 📱 Screenshots

> _Add screenshots of your app here (e.g., home screen, quote detail, favorites, etc.)_

---

## 🚀 Getting Started

### 1. **Clone the repo**

```sh
git clone https://github.com/YonAndualem/DailyDose.git
cd DailyDose
```

### 2. **Install dependencies**

```sh
npm install
# or
yarn
```

### 3. **Start the development server**

```sh
npx expo start
```

Open the Expo Go app on your device and scan the QR code, or run on emulator:

- Android: `npx expo run:android`
- iOS: `npx expo run:ios` _(Mac required)_

---

## 🔔 Building APK / iOS

To build a standalone app for Android or iOS using Expo EAS:

1. **Install EAS CLI**
   ```sh
   npm install -g eas-cli
   ```

2. **Login**
   ```sh
   eas login
   ```

3. **Build for Android**
   ```sh
   eas build -p android --profile production
   ```
   Download the APK/AAB from the Expo dashboard.

4. **Build for iOS**
   ```sh
   eas build -p ios --profile production
   ```
   Requires an Apple Developer account and a Mac for local builds.

For more, see the [Expo EAS Build docs](https://docs.expo.dev/build/introduction/).

---

## 🛠️ Project Structure

```
DailyDose/
├── assets/
│   └── images/
│       ├── icon.png
│       ├── adaptive-icon.png
│       └── splash-icon.png
├── components/
├── screens/
├── utils/
│   ├── api.ts
│   └── notifications.ts
├── App.tsx
├── app.json
└── ...
```

---

## ⚙️ Configuration

- **Expo Config**: `app.json` contains settings for app name, icons, splash, and notifications.
- **API**: Set your quote API base URL in `utils/api.ts`.

---

## 🧩 Dependencies

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [expo-router](https://expo.github.io/router/docs)
- [@react-native-picker/picker](https://github.com/react-native-picker/picker)
- and more (see `package.json`)

---

## 🐞 Troubleshooting

- **App fails to build?**
  - Make sure all icon and splash images exist and are square PNGs.
  - Run `npx expo-doctor` for health checks.
- **Notifications not showing?**
  - Ensure notification permissions are granted.
  - Check your notification scheduling code in `utils/notifications.ts`.
- **Build takes too long?**
  - First build on EAS/cloud may take 10–20 minutes. Subsequent builds are faster.

---

---

## 🙌 Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)

---

## 💡 Contributing

Pull requests are welcome! Please open an issue to discuss what you’d like to change first.

---

## 📬 Contact

Made by [YonAndualem](https://github.com/YonAndualem)