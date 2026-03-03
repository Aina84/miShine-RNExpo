/**
 * eTaiza – Rapports Floating Action Button (FAB) Component
 * Stack: React Native Expo + Tamagui + expo-linear-gradient
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../../utils/styles";

export function RapportsFab({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable style={styles.fabWrap} onPress={onPress}>
      <LinearGradient colors={[COLORS.goldLight, COLORS.goldDim]} style={styles.fab}>
        <Text style={styles.fabIcon}>📝</Text>
        <Text style={styles.fabLabel}>Nouveau Rapport</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fabWrap: { position: "relative", bottom:0, borderRadius: 16, overflow: "hidden" },
  fab: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16 },
  fabIcon: { fontSize: 18 },
  fabLabel: { fontSize: 14, fontWeight: "700", color: "#080F24" },
});
