/**
 * eTaiza – Member Filters Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { COLORS, useAppColors } from "../../../utils/styles";

interface MemberFiltersProps {
  filters: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function MemberFilters({ filters, activeFilter, setActiveFilter }: MemberFiltersProps) {
  const COLORS = useAppColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {filters.map((f) => (
        <Pressable
          key={f}
          style={[styles.filterChip, { borderColor: COLORS.borderBlue }, activeFilter === f && { backgroundColor: COLORS.gold, borderColor: COLORS.gold }]}
          onPress={() => setActiveFilter(f)}
        >
          <Text style={[styles.filterText, { color: COLORS.textSecondary }, activeFilter === f && styles.filterTextActive]}>
            {f}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
    height: 60, // Fixed height to prevent collapse
    alignItems: 'center',
    marginBottom: 40
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    backgroundColor: "transparent",
    height: 40, // Consistent height for chips
    justifyContent: 'center'
  },
  filterChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterText: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
  filterTextActive: { color: "#080F24" },
});

