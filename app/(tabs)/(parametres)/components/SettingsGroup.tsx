/**
 * eTaiza – Settings Group Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, useAppColors } from "../../../utils/styles";

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  const COLORS = useAppColors();
  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: COLORS.textMuted }]}>{title}</Text>
      <View style={[styles.groupCard, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginHorizontal: 20, marginBottom: 20 },
  groupLabel: {
    fontSize: 10.5, fontWeight: "700", color: COLORS.textMuted,
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, paddingLeft: 2,
  },
  groupCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderBlue, overflow: "hidden",
  },
});
