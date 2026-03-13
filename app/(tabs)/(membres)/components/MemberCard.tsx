import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { View } from "tamagui";
import { COLORS, useAppColors } from "../../../utils/styles";

export type Member = {
  id: number;
  name: string;
  contact: string;
  adress: string;
  description: string;
  role: string | null;
  sexe: string | null;
  status: string | null;
  createdAt: Date | null;
}

interface MemberCardProps {
  item: Member;
  index: number;
  onPress?: (member: Member) => void;
}

export function MemberCard({ item, index, onPress }: MemberCardProps) {
  const COLORS = useAppColors();

  const emoji = item.sexe == "homme" ? '👨' : '👩';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 60, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const pressAnim = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: pressAnim }] }}>
      <Pressable
        onPressIn={onIn}
        onPressOut={onOut}
        onPress={() => onPress?.(item)}
        style={[styles.memberCard, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }]}
      >


        <View style={[
          styles.memberAvatar,
          { backgroundColor: item.sexe === "homme" ? "rgba(52, 152, 219, 0.2)" : "rgba(233, 30, 99, 0.2)" }
        ]}>
          <Text style={styles.memberEmoji}>{emoji}</Text>
        </View>

        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: COLORS.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.memberRole, { color: COLORS.textSecondary }]}>{item.role}</Text>
          <Text style={[styles.memberRole, { color: COLORS.textSecondary }]}>{item.adress}</Text>
          <View style={styles.memberBadges}>
            <View style={[styles.badge, item.status == 'actif' ? styles.badgeActive : styles.badgeInactive]}>
              <Text style={[styles.badgeText, { color: item.status == "actif" ? COLORS.success : COLORS.danger }]}>
                {item.status == "actif" ? "Actif" : "Inactif"}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.memberArrow, { color: COLORS.textMuted }]}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: "row", alignItems: "center", gap: 13,
    backgroundColor: COLORS.bgCard, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderBlue,
    padding: 14, marginBottom: 10,
  },
  memberAvatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  memberEmoji: { fontSize: 22 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 3 },
  memberRole: { fontSize: 11.5, color: COLORS.textSecondary, marginBottom: 6 },
  memberBadges: { flexDirection: "row", gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  badgeActive: { backgroundColor: "rgba(52,201,138,.12)", borderColor: "rgba(52,201,138,.2)" },
  badgeInactive: { backgroundColor: "rgba(231,76,60,.1)", borderColor: "rgba(231,76,60,.2)" },
  badgeLeader: {
    backgroundColor: "rgba(232,169,35,.12)", borderWidth: 1,
    borderColor: "rgba(232,169,35,.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  badgeText: { fontSize: 9.5, fontWeight: "700" },
  memberArrow: { fontSize: 20, color: COLORS.textMuted },
});
