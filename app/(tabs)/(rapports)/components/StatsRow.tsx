/**
 * eTaiza – Stats Row Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Text, View } from "tamagui";

import { COLORS, useAppColors } from "../../../utils/styles";

interface Stat {
  icon: string;
  val: string;
  lbl: string;
}

interface StatsRowProps {
  stats: Stat[];
  headerFade: Animated.Value;
}

export function StatsRow({ stats, headerFade }: StatsRowProps) {
  const COLORS = useAppColors();
  return (
    <View style={styles.statsRow}>
      {stats.map((s) => (
        <Animated.View
          key={s.lbl}
          style={[
            styles.statCard,
            {
              opacity: headerFade,
              transform: [{ translateY: headerFade.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderBlue,
            },
          ]}
        >
          <Text style={styles.statIcon}>{s.icon}</Text>
          <Text style={[styles.statVal, { color: COLORS.textPrimary }]}>{s.val}</Text>
          <Text style={[styles.statLbl, { color: COLORS.textSecondary }]}>{s.lbl}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderBlue,
    padding: 12, alignItems: "center",
  },
  statIcon: { fontSize: 20, marginBottom: 5 },
  statVal: { fontSize: 19, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 2 },
  statLbl: { fontSize: 10, color: COLORS.textSecondary, letterSpacing: 0.5 },
});
