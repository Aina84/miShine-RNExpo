import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { useAppTheme } from "@/lib/context/ThemeContext";
import { StatType } from "@/types/StatsCardType";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Text, View } from "tamagui";



interface StatCardProps {
  stat: StatType;
  delay: number;
}

export function StatCard({ stat, delay }: StatCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const styles = useAppStyles();
  const COLORS = useAppColors();
  const { isDark } = useAppTheme();

  const isMembers = stat.id === "members";
  const currentGradient = isMembers
    ? (isDark ? ["#0E1A38", "#122045"] : ["#FFFFFF", "#F0F2F5"])
    : (isDark ? ["#1A1400", "#2A1E00"] : ["#FFFFFF", "#FFF9E6"]);
  const currentAccent = isMembers ? COLORS.blueLight : COLORS.gold; useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={currentGradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}
      >
        {/* Border accent line */}
        <View
          style={[styles.statAccentLine, { backgroundColor: currentAccent }]}
        />

        {/* Top row */}
        <View style={styles.statTopRow}>
          <View style={styles.statIconWrapper}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
          </View>
          <View
            style={[
              styles.deltaBadge,
              {
                backgroundColor: stat.deltaPositive
                  ? "rgba(52,201,138,0.12)"
                  : "rgba(231,76,60,0.12)",
              },
            ]}
          >
            <Text
              style={[
                styles.deltaText,
                { color: stat.deltaPositive ? COLORS.success : "#FF5252" },
              ]}
            >
              ↑ {stat.delta}
            </Text>

          </View>
        </View>

        {/* Value */}
        <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{stat.value}</Text>
        <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>{stat.label}</Text>

        {/* Decorative corner circle */}
        <View
          style={[styles.cornerCircle, { borderColor: currentAccent }]}
        />
      </LinearGradient>
    </Animated.View>
  );
}