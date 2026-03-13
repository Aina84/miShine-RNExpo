import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { Text, View } from "tamagui";

interface ActionButtonProps {
  label: string;
  icon: string;
  primary?: boolean;
  delay: number;
  onPress?: () => void;
}

export function ActionButton({
  label,
  icon,
  primary = false,
  delay,
  onPress,
}: ActionButtonProps) {
  const styles = useAppStyles();
  const COLORS = useAppColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.actionButtonWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: pressAnim }],
          flex: 1,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.actionButtonPressable}
      >
        {primary ? (
          <LinearGradient
            colors={[COLORS.gold, COLORS.goldDim]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionIcon}>{icon}</Text>
            <Text style={[styles.actionLabel, { color: "#080F24" }]}>
              {label}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.actionButtonOutline}>
            <Text style={styles.actionIcon}>{icon}</Text>
            <Text style={[styles.actionLabel, { color: COLORS.textPrimary }]}>
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
