/**
 * eTaiza – Finances Header Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { Animated, Pressable, StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../utils/styles";
import { Text, View } from "tamagui";

interface FinancesHeaderProps {
  headerFade: Animated.Value;
}

export function FinancesHeader({ headerFade }: FinancesHeaderProps) {
  return (
    <Animated.View style={[styles.header, { opacity: headerFade }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Finances</Text>
          <Text style={styles.headerSub}>Gestion des offrandes</Text>
        </View>
        <Pressable style={styles.addBtn}>
          <Text style={styles.addBtnText}>➕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Platform.OS === "ios" ? 56 : 40, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerTitle: { fontSize: 28, fontWeight: "800" },
  headerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1,
    borderColor: COLORS.borderBlue, alignItems: "center", justifyContent: "center",
  },
  addBtnText: { fontSize: 18 },
});
