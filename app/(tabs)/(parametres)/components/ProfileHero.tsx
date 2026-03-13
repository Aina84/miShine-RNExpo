/**
 * eTaiza – Profile Hero Component
 * Stack: React Native Expo + Tamagui + expo-linear-gradient
 */

import { useAppTheme } from "@/lib/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, useAppColors } from "../../../utils/styles";
import { Badge } from "./Badge";

interface ProfileHeroProps {
  fadeAnim: Animated.Value;
  profileSlide: Animated.Value;
  userName?: string;
  userEmail?: string;
}

export function ProfileHero({ fadeAnim, profileSlide, userName, userEmail }: ProfileHeroProps) {
  const COLORS = useAppColors();
  const { isDark } = useAppTheme();
  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: profileSlide }] }]}>
      <View style={styles.profileHero}>
        <LinearGradient
          colors={isDark ? ["#0E1A38", "#162040"] : ["#FFFFFF", "#F0F2F5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderColor: COLORS.borderBlue, borderWidth: 1, borderRadius: 22 }]}
        />
        {/* Top accent */}
        <View style={styles.heroAccentLine} />

        <View style={{ position: "relative", zIndex: 1, alignItems: "center" }}>
          <LinearGradient
            colors={[COLORS.goldLight, COLORS.goldDim]}
            style={styles.profileAv}
          >
            <Text style={styles.profileAvText}>👨‍💼</Text>
          </LinearGradient>
          <Text style={[styles.profileName, { color: COLORS.textPrimary }]}>{userName || "Pasteur"}</Text>
          <Text style={[styles.profileRole, { color: COLORS.textSecondary }]}>{userEmail || "Responsable principal · Église *****"}</Text>


          <View style={styles.profileChips}>
            <Badge label="Administrateur" color={COLORS.gold} bg="rgba(232,169,35,.12)" border="rgba(232,169,35,.2)" />
            <Badge label="Madagascar" color={COLORS.accent} bg="rgba(74,127,229,.12)" border="rgba(74,127,229,.2)" />
          </View>

          <Pressable style={styles.editProfileBtn}>
            <Text style={styles.editProfileLabel}>Modifier le profil</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  profileHero: {
    marginHorizontal: 20, marginBottom: 20,
    borderRadius: 22, overflow: "hidden",
    borderWidth: 1, borderColor: COLORS.border,
    padding: 24, alignItems: "center",
  },
  heroAccentLine: {
    position: "absolute", top: 0, left: 20, right: 20,
    height: 2, backgroundColor: COLORS.gold, opacity: 0.6,
    borderRadius: 1,
  },
  profileAv: {
    width: 72, height: 72, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  profileAvText: { fontSize: 32 },
  profileName: { fontSize: 19, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 4, textAlign: "center" },
  profileRole: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 14, textAlign: "center", lineHeight: 17 },
  profileChips: { flexDirection: "row", gap: 8, marginBottom: 16 },
  editProfileBtn: {
    paddingHorizontal: 24, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1, borderColor: "rgba(232,169,35,0.3)",
    backgroundColor: "rgba(232,169,35,0.08)",
  },
  editProfileLabel: { fontSize: 13, fontWeight: "600", color: COLORS.gold },
});
