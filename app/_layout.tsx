import migration from '@/drizzle/migrations'
import { db } from '@/lib/database/db'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PortalProvider, TamaguiProvider } from 'tamagui'
import { config } from '../tamagui.config'

import { ThemeProvider, useAppTheme } from '@/lib/context/ThemeContext'

function AppContent() {
  const { theme } = useAppTheme();

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <PortalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='index' options={{ headerShown: false }} />
        </Stack>
      </PortalProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  const { success, error } = useMigrations(db, migration);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration Error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Database...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}