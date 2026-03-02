import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text
} from "react-native";

import { View } from "tamagui";

import { COLORS, styles } from "@/app/utils/styles";
import { STATS } from "./components/StatCard";

import { ActionButton } from "./components/ActionButton";
import { ChartSection } from "./components/ChartSection";
import { Header } from "./components/Header";
import { RecentActivity } from "./components/RecentActivity";
import { StatCard } from "./components/StatCard";

import { AddSheepCard } from "./components/AddSheepCard";



export default function DashboardScreen() {
  const [refreshing] = useState(false);
  const [addClicked, setAddClicked] = useState<boolean | null>(null);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Full-screen background */}
      <LinearGradient
        colors={[COLORS.bg, "#0C1530", COLORS.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <AddSheepCard
        visible={addClicked === true}
        onClose={() => setAddClicked(null)}
        onUserAdded={() => setAddClicked(null)}
      />

      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Header />

        {/* Stat Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
          <View style={styles.statsRow}>
            {STATS.map((stat, i) => (
              <StatCard key={stat.id} stat={stat} delay={100 + i * 120} />
            ))}
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <ChartSection />
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsRow}>
            <ActionButton
              label="Ajouter Brebis"
              icon="🐑"
              primary={true}
              delay={400}
              onPress={() => setAddClicked(true)}
            />
            <ActionButton
              label="Ajouter Rapport"
              icon="📋"
              primary={false}
              delay={520}
              onPress={() => console.log("Ajouter Rapport")}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <RecentActivity />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

