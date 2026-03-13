/**
 * eTaiza – Report Card Component
 * Stack: React Native Expo + Tamagui
 */

import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { Text, View } from "tamagui";
import { COLORS, useAppColors } from "../../../utils/styles";

export type ReportType = "culte" | "dime" | "offrande" | "autre";

const TYPE_META: Record<ReportType, { bg: string; color: string; border: string }> = {
  culte: { bg: "rgba(74,127,229,.15)", color: "#4A7FE5", border: "rgba(74,127,229,.25)" },
  dime: { bg: "rgba(232,169,35,.12)", color: "#E8A923", border: "rgba(232,169,35,.2)" },
  offrande: { bg: "rgba(52,201,138,.12)", color: "#34C98A", border: "rgba(52,201,138,.2)" },
  autre: { bg: "rgba(168,74,229,.12)", color: "#A84AE5", border: "rgba(168,74,229,.2)" },
};

interface ReportCardProps {
  report: {
    id: any; type: ReportType; typeLbl: string;
    title: string; desc: string; date: string;
    amount: string; author: string;
  };
  index: number;
  onPress?: (report: any) => void;
}

export function ReportCard({ report, index, onPress }: ReportCardProps) {

  const COLORS = useAppColors();

  const meta = TYPE_META[report.type];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(22)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, delay: index * 70, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 70, useNativeDriver: true, tension: 75, friction: 10 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: pressAnim }] }}>
      <Pressable
        style={[styles.reportCard, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }]}
        onPressIn={() => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start()}

        onPress={() => onPress?.(report)}
      >

        {/* Top row */}
        <View style={styles.cardTop}>
          <View style={[styles.typeBadge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
            <Text style={[styles.typeBadgeText, { color: meta.color }]}>{report.typeLbl}</Text>
          </View>
          <Text style={[styles.cardDate, { color: COLORS.textMuted }]}>{report.date}</Text>
        </View>

        <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]}>{report.title}</Text>
        <Text style={[styles.cardDesc, { color: COLORS.textSecondary }]}>{report.desc}</Text>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={[styles.cardAmount, { color: COLORS.textMuted }, report.amount !== "—" && { color: COLORS.gold }]}>
            {report.amount}
          </Text>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={{ fontSize: 10 }}>👤</Text>
            </View>
            <Text style={[styles.authorName, { color: COLORS.textMuted }]}>{report.author}</Text>
          </View>
        </View>

        {/* Left accent bar */}
        <View style={[styles.cardAccentBar, { backgroundColor: meta.color }]} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderBlue,
    padding: 16, marginHorizontal: 20, marginBottom: 11,
    overflow: "hidden",
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  typeBadgeText: { fontSize: 10, fontWeight: "700" },
  cardDate: { fontSize: 11, color: COLORS.textMuted },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardAmount: { fontSize: 15, fontWeight: "800", color: COLORS.textMuted },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  authorAvatar: {
    width: 20, height: 20, borderRadius: 6,
    backgroundColor: "rgba(74,127,229,0.2)", alignItems: "center", justifyContent: "center",
  },
  authorName: { fontSize: 11, color: COLORS.textMuted },
  cardAccentBar: { position: "absolute", top: 16, bottom: 16, left: 0, width: 3, borderRadius: 2 },
});
