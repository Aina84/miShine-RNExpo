# miShine 👋

A modern, high-performance mobile application built with **Expo**, **Tamagui**, and **Drizzle ORM**. **miShine** is designed to provide a seamless user experience for managing dashboard activities, finances, members, and reports.

## 🚀 Key Features

- **Dashboard**: Real-time overview of activities and key statistics.
- **Finances Management**: Track transactions, manage budgets, and visualize financial growth.
- **Member Directory**: Efficiently manage member profiles, contact information, and roles.
- **Reports & Analytics**: Generate comprehensive reports and gain insights from data visualizations.
- **Settings & Customization**: Personalized themes, account settings, and application preferences.
- **Authentication**: Secure user login and registration flow.
- **Local Persistence**: Fast and reliable local data storage using Drizzle ORM and Expo SQLite.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **UI Components**: [Tamagui](https://tamagui.dev/) (Styling and Component library)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Icons**: [Lucide Icons](https://lucide.dev/) (via Tamagui)
- **Networking**: [Axios](https://axios-http.com/)

## 📦 Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## 🏗 Project Structure

- `app/`: Main application screens and routing (using Expo Router).
  - `(auth)`: Authentication related screens.
  - `(tabs)`: Bottom tab navigation flows (Dashboard, Finances, Members, etc.).
- `components/`: Reusable UI components.
- `lib/`: Business logic, services, and utilities.
  - `services/`: API and authentication services.
- `store/`: Zustand state management.
- `drizzle/`: Database migrations and schema definitions.
- `assets/`: Images, fonts, and other static assets.

## 🧪 Development

### Linting

```bash
npm run lint
```

### Database Migrations

This project uses Drizzle Kit for migrations.

```bash
npx drizzle-kit generate
```

## 🤝 Community

Join the Expo community to learn more:

- [Expo documentation](https://docs.expo.dev/)
- [Discord community](https://chat.expo.dev)
- [Expo on GitHub](https://github.com/expo/expo)
