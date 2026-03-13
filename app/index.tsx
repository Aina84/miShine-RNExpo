import { authService } from '@/lib/services/authService'
import { Hand } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Spinner, Text, YStack } from 'tamagui'
import { COLORS } from './utils/styles'

export default function index() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const user = await authService.getCurrentUser();
      if (user) {
        router.replace('/(tabs)/(dashboard)/dashboard');
      } else {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  function handleroute() {
    router.push('/(auth)/login');
  }

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
        <Spinner size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LinearGradient
        colors={[COLORS.bg, "#0C1530", COLORS.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <YStack rowGap={20} ai="center">
        <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../assets/images/icon.png')}></Image>
        <Button
          backgroundColor={COLORS.gold}
          size="$5"
          onPress={handleroute}
        >

          <Text color="black" fontWeight="bold">CONTINUE TO LOGIN</Text>
        </Button>

      </YStack>
    </View>
  )
}

