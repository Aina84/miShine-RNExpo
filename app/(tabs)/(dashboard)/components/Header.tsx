import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { useAppTheme } from "@/lib/context/ThemeContext";
import { authService } from "@/lib/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable } from "react-native";
import { Text, View } from "tamagui";





export function Header() {
  const [userName, setUserName] = useState("Pasteur");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = useAppStyles();
  const COLORS = useAppColors();
  const { isDark } = useAppTheme();



  useEffect(() => {
    async function loadUser() {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserName(user.name);
      }
    }
    loadUser();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Bonjour"
      : now.getHours() < 18
        ? "Bon après-midi"
        : "Bonsoir";

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={isDark ? ["#0A1428", "#080F24"] : ["#FFFFFF", "#FFFFFF"]}
        style={styles.headerGradient}
      >
        {/* Top row */}
        <View style={styles.headerTopRow}>
          <View style={styles.headerLogoArea}>
            <LinearGradient
              colors={[COLORS.gold, COLORS.goldDim]}
              style={styles.logoMark}
            >
              <Text style={styles.logoMarkText}>✝</Text>
            </LinearGradient>
            <View>
              <Text style={styles.appName}>miShine</Text>

              <Text style={styles.appTagline}>Gestion d'Église</Text>
            </View>
          </View>
          <Pressable style={styles.notifButton}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBadge} />
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>
            {greeting},{" "}
            <Text style={styles.greetingName}>{userName} 👋</Text>
          </Text>
          <Text style={styles.dateText}>
            {now.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>


        {/* Gold divider */}
        <View style={styles.headerDivider} />
      </LinearGradient>
    </Animated.View>
  );
}