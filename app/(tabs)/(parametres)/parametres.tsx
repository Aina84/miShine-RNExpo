/**
 * eTaiza – Paramètres Screen
 * Stack: React Native Expo + Tamagui + expo-linear-gradient
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

import { authService, User } from "@/lib/services/authService";
import * as FileSystem from 'expo-file-system/legacy';

import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { useAppTheme } from "@/lib/context/ThemeContext";
import { useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';

import { Arrow } from "./components/Arrow";
import { Badge } from "./components/Badge";
import { LogoutButton } from "./components/LogoutButton";
import { ParametresHeader } from "./components/ParametresHeader";
import { ProfileHero } from "./components/ProfileHero";
import { SettingItem } from "./components/SettingItem";
import { SettingsGroup } from "./components/SettingsGroup";
import { ToggleSwitch } from "./components/ToggleSwitch";

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ParametresScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifPush, setNotifPush] = useState(true);
  const [notifCulte, setNotifCulte] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const { theme, toggleTheme, isDark } = useAppTheme();
  const styles = useAppStyles();
  const COLORS = useAppColors();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const profileSlide = useRef(new Animated.Value(30)).current;


  useEffect(() => {
    async function loadUser() {
      const u = await authService.getCurrentUser();
      setUser(u);
    }
    loadUser();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(profileSlide, { toValue: 0, delay: 100, useNativeDriver: true, tension: 70, friction: 12 }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Se déconnecter",
      "Voulez-vous vraiment vous déconnecter de miShine ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnecter",
          style: "destructive",
          onPress: async () => {
            await authService.logout();
            router.replace("/");
          }
        },
      ]
    );
  };

  const handleExportDB = async () => {
    try {
      const dbPath = `${FileSystem.documentDirectory}SQLite/app2.db`;
      const fileInfo = await FileSystem.getInfoAsync(dbPath);

      if (!fileInfo.exists) {
        Alert.alert("Erreur", "Base de données introuvable.");
        return;
      }

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
        return;
      }

      await Sharing.shareAsync(dbPath, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Sauvegarder les données eTaiza',
        UTI: 'public.database'
      });
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Erreur", "Impossible d'exporter les données.");
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={COLORS.bg} />


      <LinearGradient colors={isDark ? [COLORS.bg, "#0C1530", COLORS.bg] : [COLORS.bg, "#FFFFFF", COLORS.bg]} style={StyleSheet.absoluteFill} />


      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <ParametresHeader fadeAnim={fadeAnim} />

        {/* Profile Hero */}
        <ProfileHero
          fadeAnim={fadeAnim}
          profileSlide={profileSlide}
          userName={user?.name}
          userEmail={user?.email}
        />


        {/* ── Église ── */}
        <SettingsGroup title="Église">
          <SettingItem
            icon="⛪" iconBg="rgba(232,169,35,.12)" label="Informations de l'église"
            right={<Arrow />}
            onPress={() => console.log("Church info")}
          />
          <SettingItem
            icon="👥" iconBg="rgba(74,127,229,.12)" label="Groupes & Cellules"
            right={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Badge label="6 groupes" color={COLORS.accent} bg="rgba(74,127,229,.15)" border="rgba(74,127,229,.25)" />
                <Arrow />
              </View>
            }
            onPress={() => console.log("Groups")}
          />
          <SettingItem
            icon="📅" iconBg="rgba(52,201,138,.12)" label="Calendrier liturgique"
            right={<Arrow />}
            onPress={() => console.log("Calendar")}
            isLast
          />
        </SettingsGroup>

        {/* ── Utilisateurs ── */}
        <SettingsGroup title="Utilisateurs & Accès">
          <SettingItem
            icon="🔐" iconBg="rgba(168,74,229,.12)" label="Rôles & Permissions"
            right={<Arrow />}
            onPress={() => console.log("Roles")}
          />
          <SettingItem
            icon="👤" iconBg="rgba(231,76,60,.12)" label="Mon compte"
            right={<Arrow />}
            onPress={() => console.log("Account")}
          />
          <SettingItem
            icon="🔑" iconBg="rgba(232,169,35,.12)" label="Changer le mot de passe"
            right={<Arrow />}
            onPress={() => console.log("Password")}
            isLast
          />
        </SettingsGroup>

        {/* ── Notifications ── */}
        <SettingsGroup title="Notifications">
          <SettingItem
            icon="🔔" iconBg="rgba(74,127,229,.12)" label="Notifications push"
            right={<ToggleSwitch value={notifPush} onChange={setNotifPush} />}
          />
          <SettingItem
            icon="💬" iconBg="rgba(52,201,138,.12)" label="Rappels cultes"
            right={<ToggleSwitch value={notifCulte} onChange={setNotifCulte} />}
          />
          <SettingItem
            icon="📊" iconBg="rgba(232,169,35,.12)" label="Rapport hebdomadaire"
            right={<ToggleSwitch value={notifWeekly} onChange={setNotifWeekly} />}
            isLast
          />
        </SettingsGroup>

        {/* ── Affichage ── */}
        <SettingsGroup title="Affichage">
          <SettingItem
            icon="🌙" iconBg="rgba(74,127,229,.12)" label="Mode sombre"
            right={<ToggleSwitch value={isDark} onChange={toggleTheme} />}
          />

          <SettingItem
            icon="🌍" iconBg="rgba(74,127,229,.12)" label="Langue"
            right={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.settingValue}>Français</Text>


                <Arrow />
              </View>
            }
            onPress={() => console.log("Language")}
            isLast
          />
        </SettingsGroup>

        {/* ── Application ── */}
        <SettingsGroup title="Application">
          <SettingItem
            icon="💾" iconBg="rgba(255,255,255,.06)" label="Sauvegarder les données"
            right={<Arrow />}
            onPress={handleExportDB}
          />

          <SettingItem
            icon="🔄" iconBg="rgba(52,201,138,.12)" label="Synchronisation"
            right={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Badge label="À jour" color={COLORS.success} bg="rgba(52,201,138,.12)" border="rgba(52,201,138,.2)" />
                <Arrow />
              </View>
            }
            onPress={() => console.log("Sync")}
          />
          <SettingItem
            icon="ℹ️" iconBg="rgba(74,127,229,.12)" label="À propos de miShine"
            right={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.versionText}>v1.0.0</Text>


                <Arrow />
              </View>
            }
            onPress={() => console.log("About")}
            isLast
          />
        </SettingsGroup>

        {/* Logout */}
        <LogoutButton handleLogout={handleLogout} />

        <Text style={styles.footer}>miShine v1.0.0 · Fait avec ✝ pour l'Église</Text>



        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}


