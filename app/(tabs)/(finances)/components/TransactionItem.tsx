import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, useAppColors } from "../../../utils/styles";

export type TransactionItemType = {
  id: number | string;
  icon: string;
  type: "income" | "expense" | string;
  name: string;
  category: string;
  date: string;
  amount: number | string;
};

export function TransactionItem({ item, index, onPress }: { item: TransactionItemType; index: number; onPress?: (item: TransactionItemType) => void }) {
  const COLORS = useAppColors();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 55, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 55, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Pressable style={[styles.transactionItem, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }]} onPress={() => onPress?.(item)}>

        <View style={[styles.transIcon, { backgroundColor: item.type === "income" ? "rgba(52,201,138,.1)" : "rgba(231,76,60,.1)" }]}>
          <Text style={styles.transIconText}>{item.icon}</Text>
        </View>
        <View style={styles.transInfo}>
          <Text style={[styles.transName, { color: COLORS.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.transMeta, { color: COLORS.textMuted }]}>{item.category} · {item.date}</Text>
        </View>
        <Text style={[styles.transAmount, { color: item.type === "income" ? COLORS.success : COLORS.danger }]}>
          {item.type === "income" ? "+" : "-"}{item.amount.toLocaleString()} Ar
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: COLORS.bgCard, borderRadius: 15,
    borderWidth: 1, borderColor: COLORS.borderBlue,
    paddingHorizontal: 15, paddingVertical: 13,
    marginHorizontal: 20, marginBottom: 9,
  },
  transIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  transIconText: { fontSize: 17 },
  transInfo: { flex: 1 },
  transName: { fontSize: 13.5, fontWeight: "600", color: COLORS.textPrimary, marginBottom: 2 },
  transMeta: { fontSize: 11, color: COLORS.textMuted },
  transAmount: { fontSize: 14.5, fontWeight: "800" },
});
