/**
 * eTaiza – Rapports Floating Action Button (FAB) Component
 * Stack: React Native Expo + Tamagui + expo-linear-gradient
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../../utils/styles";
import { View } from "tamagui";

export function RapportsFab({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.fabWrap}>
    <Pressable style={styles.fab} onPress={onPress}>
      <LinearGradient colors={[COLORS.goldLight, COLORS.goldDim]}>
        <Text style={styles.fabIcon}>📝</Text>
      </LinearGradient>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrap: { position: "absolute", bottom:50, alignSelf:'center', width:"17%"},
  fab: { overflow: "hidden", borderRadius:"50%" },
  fabGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", },
  fabIcon: { fontSize: 27, margin:10 },
});
