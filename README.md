# MyApp - Expo React Native App

A React Native application built with Expo for camera-based analysis and processing.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI (install globally with `npm install -g @expo/cli`)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development Commands

### Start the development server
```bash
npm start
# or
expo start
```

### Platform-specific builds
```bash
# Run on Android
npm run android
# or
expo start --android

# Run on iOS
npm run ios
# or
expo start --ios

# Run on Web
npm run web
# or
expo start --web
```

## Project Structure

- `src/screens/` - Application screens
- `src/components/` - Reusable components
- `src/services/` - API and service layer
- `src/hooks/` - Custom React hooks
- `src/styles/` - Styling utilities

## Features

- Camera integration with video recording
- Processing and analysis workflows
- Multi-screen navigation
- Results display and export

## Dependencies

- Expo SDK ~53.0.22
- React Navigation
- Expo Camera
- Axios for API calls
- TypeScript support