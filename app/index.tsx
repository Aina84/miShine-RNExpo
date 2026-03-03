import { StyleSheet, View } from 'react-native'
import { Hand } from '@tamagui/lucide-icons'
import { YStack, Button, Text } from 'tamagui'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from './utils/styles'
import { Image } from 'expo-image'
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator'
import migration from '@/drizzle/migrations'
import { db } from '@/lib/database/db'
import { ActivityIndicator } from 'react-native'

export default function index() {
  const route = useRouter();
  function handleroute(){
    route.push('/(tabs)/(dashboard)/dashboard');
  }
  
  const { success, error } = useMigrations(db, migration);
  
 
  if (success) {
    console.log('Migration réussie');
  }
  if (!success) {
    console.log('Migration échouée');
  }
  if (error) {
    console.log(error);
  }

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <LinearGradient
        colors={[COLORS.bg, "#0C1530", COLORS.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <YStack rowGap={20}>
        <Text fontSize={40} fontWeight={600}>welcome <Hand size={40} color={'orange'}></Hand></Text>
        <Image style={{width:100, height:100, alignSelf:'center'}} source={require('../assets/images/icon.png')}></Image>
        <Button elevation={10} theme={'light'} onPress={handleroute}>CONTINUE</Button>
      </YStack>
    </View>
  )
}
