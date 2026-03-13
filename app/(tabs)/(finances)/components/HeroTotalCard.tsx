/**
 * eTaiza – Hero Total Card Component
 * Stack: React Native Expo + Tamagui
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../utils/styles";

interface HeroTotalCardProps {
  heroSlide: Animated.Value;
  totalIncome: number;
  totalExpense: number;
}

export function HeroTotalCard({ heroSlide, totalIncome, totalExpense }: HeroTotalCardProps) {
  const balance = totalIncome - totalExpense;
  return (
    <Animated.View style={[styles.heroWrap, { transform: [{ translateY: heroSlide }] }]}>
      <View style={styles.heroInner}>
        {/* Dark gold background */}
        <LinearGradient
          colors={["#1A1400", "#2C2000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Glow */}
        <View style={styles.heroGlow} />

        <View style={{ position: "relative", zIndex: 1 }}>
          <Text style={styles.heroLabel}>Solde Actuel</Text>
          <Text style={styles.heroAmount}>{balance.toLocaleString()} Ar</Text>
          <Text style={styles.heroGrowth}>Total des entrées</Text>

          <View style={styles.heroMinis}>
            {[["Entrées", `${totalIncome.toLocaleString()} Ar`], ["Sorties", `${totalExpense.toLocaleString()} Ar`]].map(([lbl, val]) => (
              <View key={lbl} style={styles.heroMini}>
                <Text style={styles.heroMiniLabel}>{lbl}</Text>
                <Text style={styles.heroMiniVal}>{val}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, overflow: "hidden" },
  heroInner: { padding: 22, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(232,169,35,0.2)" },
  heroGlow: {
    position: "absolute", top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(232,169,35,0.18)",
  },
  heroLabel: { fontSize: 10.5, color: "rgba(249,223,138,.7)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 },
  heroAmount: { fontSize: 34, fontWeight: "800", color: COLORS.goldLight, marginBottom: 4, lineHeight: 38 },
  heroGrowth: { fontSize: 12, color: "rgba(249,223,138,.6)", marginBottom: 16 },
  heroMinis: { flexDirection: "row", gap: 10 },
  heroMini: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12,
    padding: 10, borderWidth: 1, borderColor: "rgba(232,169,35,0.12)",
  },
  heroMiniLabel: { fontSize: 9.5, color: "rgba(249,223,138,.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  heroMiniVal: { fontSize: 15, fontWeight: "700", color: COLORS.goldLight },
});
