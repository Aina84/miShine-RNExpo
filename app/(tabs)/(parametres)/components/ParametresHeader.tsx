/**
 * eTaiza – Parametres Header Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../../utils/styles";
import { Text } from "tamagui";

interface ParametresHeaderProps {
  fadeAnim: Animated.Value;
}

export function ParametresHeader({ fadeAnim }: ParametresHeaderProps) {
  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <Text style={styles.headerSub}>Configuration de l'application</Text>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editBtnIcon}>✏️</Text>
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
  editBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1,
    borderColor: COLORS.borderBlue, alignItems: "center", justifyContent: "center",
  },
  editBtnIcon: { fontSize: 16 },
});
