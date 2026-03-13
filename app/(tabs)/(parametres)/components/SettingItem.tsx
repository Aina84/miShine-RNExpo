/**
 * eTaiza – Setting Item Component
 * Stack: React Native Expo + Tamagui
 */

import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, useAppColors } from "../../../utils/styles";

export interface SettingItemProps {
  icon: string;
  iconBg: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

export function SettingItem({ icon, iconBg, label, right, onPress, isLast }: SettingItemProps) {
  const COLORS = useAppColors();
  const pressAnim = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(pressAnim, { toValue: 0.98, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <>
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={onIn}
          onPressOut={onOut}
          style={styles.settingItem}
        >
          <View style={[styles.siIconWrap, { backgroundColor: iconBg }]}>
            <Text style={styles.siIcon}>{icon}</Text>
          </View>
          <Text style={[styles.siLabel, { color: COLORS.textPrimary }]}>{label}</Text>
          <View style={styles.siRight}>{right}</View>
        </Pressable>
      </Animated.View>
      {!isLast && <View style={styles.settingDivider} />}
    </>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14, gap: 13,
  },
  settingDivider: { height: 1, backgroundColor: "rgba(74,127,229,0.1)", marginLeft: 65 },
  siIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  siIcon: { fontSize: 17 },
  siLabel: { flex: 1, fontSize: 13.5, color: COLORS.textPrimary, fontWeight: "500" },
  siRight: { flexDirection: "row", alignItems: "center", gap: 6 },
});
