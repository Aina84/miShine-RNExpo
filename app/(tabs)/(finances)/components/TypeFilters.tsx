/**
 * eTaiza – Type Filters Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { COLORS, useAppColors } from "../../../utils/styles";

interface TypeFilter {
  key: string;
  label: string;
  icon: string;
}

interface TypeFiltersProps {
  typeFilters: TypeFilter[];
  activeType: string;
  setActiveType: (key: string) => void;
}

export function TypeFilters({ typeFilters, activeType, setActiveType }: TypeFiltersProps) {
  const COLORS = useAppColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
      {typeFilters.map((t) => (
        <Pressable
          key={t.key}
          style={[styles.typeChip, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }, activeType === t.key && styles.typeChipActive]}
          onPress={() => setActiveType(t.key)}
        >
          <Text style={styles.typeChipIcon}>{t.icon}</Text>
          <Text style={[styles.typeChipLabel, { color: COLORS.textSecondary }, activeType === t.key && { color: COLORS.gold }]}>{t.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  typeRow: { paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  typeChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderBlue,
    backgroundColor: COLORS.bgCard, alignItems: "center", minWidth: 68,
  },
  typeChipActive: {
    backgroundColor: "rgba(232,169,35,0.12)",
    borderColor: "rgba(232,169,35,0.35)",
  },
  typeChipIcon: { fontSize: 18, marginBottom: 4 },
  typeChipLabel: { fontSize: 10.5, color: COLORS.textSecondary, fontWeight: "600" },
});
