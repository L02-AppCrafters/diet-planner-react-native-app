# Nutri Planner Mobile

Nutri Planner Mobile is an Expo React Native prototype for a nutrition planning app. It focuses on a polished mobile experience for onboarding, body profile setup, meal logging, food nutrition details, recipe discovery, and progress tracking.

## Features

- Goal onboarding with selectable nutrition paths
- Body profile setup with validated numeric inputs for height, weight, and age
- Home dashboard with calories, macros, water tracking, meal cards, insights, and weekly overview
- Log flow with weekly plan, add snack, food nutrition detail, and ingredients list
- Recipes and progress analytics screens
- Profile/body metrics UI including BMI and estimated TDEE

## Tech Stack

- Expo `~54`
- React `19`
- React Native `0.81`
- TypeScript
- React Native SVG
- Expo Font
- Google Fonts: Inter and Manrope

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Expo CLI through `npx expo`
- Android Studio and an Android emulator, or a physical Android device with Expo Go

## Installation

From the app directory:

```bash
cd nutri-planner-mobile
npm install
```

## Running The App

Start the Expo development server:

```bash
npm start
```

Run directly on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

Android emulator is the preferred target for this project.

## Type Checking

Run TypeScript validation with:

```bash
npx tsc --noEmit
```

## Project Structure

```text
.
|-- App.tsx
|-- app.json
|-- assets/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- data/
|   |-- screens/
|   |   |-- home/
|   |   |-- log/
|   |   |-- onboarding/
|   |   |-- profile/
|   |   |-- progress/
|   |   `-- recipes/
|   |-- theme/
|   `-- types/
`-- package.json
```

## Build the app with EAS Build

Install the EAS CLI:

```
npm install -g eas-cli
```

Log in Expo:

```
eas login
```

Initialize the build configuration:

```
eas build:configure
```

Set up environment for build:

```
eas env:create --name EXPO_PUBLIC_API_URL --value "https://diet-planner-server.onrender.com/api" --environment preview --visibility plaintext
```

Check the availability:

```
eas env:list --environment preview
```

Build the app:

```
eas build --platform android --profile preview --clear-cache
```
