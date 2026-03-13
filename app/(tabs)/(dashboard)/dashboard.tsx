import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text
} from "react-native";

import { View } from "tamagui";

import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { useAppTheme } from "@/lib/context/ThemeContext";



import { ActionButton } from "./components/ActionButton";
import { ChartSection } from "./components/ChartSection";

import { Header } from "./components/Header";
import { RecentActivity } from "./components/RecentActivity";
import { StatCard } from "./components/StatCard";

import { AddSheepCard } from "@/components/shared/AddSheepCard";

import { db } from "@/lib/database/db";
import { finances, sheeps } from "@/lib/database/schema";
import { financeRepository } from "@/lib/repository/databaseRepositories";
import { StatType } from "@/types/StatsCardType";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function DashboardScreen() {
  const [refreshing] = useState(false);
  const [addClicked, setAddClicked] = useState<boolean | null>(null);
  const [financesData, setFinancesData] = useState<any[]>([]);
  const [stats, setStats] = useState<StatType[]>([])

  const styles = useAppStyles();
  const COLORS = useAppColors();
  const { isDark } = useAppTheme();


  const fetchFinances = async () => {
    try {
      const data = await financeRepository.findAll();
      setFinancesData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getStats = async () => {
    try {
      const allMembers = await db.select().from(sheeps);
      const members = allMembers.length;
      const transactions = await db.select().from(finances);

      // --- Calculate Member Delta (New in last 30 days) ---
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newMembersCount = allMembers.filter(m => {
        const createdAt = m.createdAt ? new Date(m.createdAt) : new Date(0);
        return createdAt >= thirtyDaysAgo;
      }).length;

      // --- Calculate Offering Delta (% change vs previous 30 days) ---
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const currentPeriodIncome = transactions
        .filter(t => t.type === 'income' && t.createdAt && new Date(t.createdAt) >= thirtyDaysAgo)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      const previousPeriodIncome = transactions
        .filter(t => t.type === 'income' && t.createdAt && new Date(t.createdAt) >= sixtyDaysAgo && new Date(t.createdAt) < thirtyDaysAgo)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      let offeringDeltaText = "0%";
      let offeringDeltaPositive = true;

      if (previousPeriodIncome > 0) {
        const diff = ((currentPeriodIncome - previousPeriodIncome) / previousPeriodIncome) * 100;
        offeringDeltaPositive = diff >= 0;
        offeringDeltaText = `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
      } else if (currentPeriodIncome > 0) {
        offeringDeltaText = "+100%";
        offeringDeltaPositive = true;
      }

      const totalIncome = transactions.filter((t) => t.type == "income").reduce((acc, t) => acc + Number(t.amount), 0);
      const totalExpense = transactions.filter((t) => t.type == "expense").reduce((acc, t) => acc + Number(t.amount), 0);

      const totalAmount = totalIncome - totalExpense;

      setStats([
        {
          id: "members",
          label: "Total Membres",
          value: String(members),
          delta: `+${newMembersCount}`,
          deltaPositive: true,
          icon: "👥",
          gradient: isDark ? ["#0E1A38", "#122045"] as [string, string] : ["#FFFFFF", "#F0F2F5"] as [string, string],
          accentColor: COLORS.blueLight,
        },
        {
          id: "offerings",
          label: "Offrandes Cumulées",
          value: `${(totalAmount).toLocaleString('fr-FR')} Ar`,
          delta: offeringDeltaText,
          deltaPositive: offeringDeltaPositive,
          icon: "🙏",
          gradient: isDark ? ["#1A1400", "#2A1E00"] as [string, string] : ["#FFFFFF", "#FFF9E6"] as [string, string],
          accentColor: COLORS.gold,
        },
      ])

    } catch (e) {
      console.error(e)
    }
  }


  useFocusEffect(
    useCallback(() => {
      fetchFinances();
      getStats();
    }, [])
  );

  React.useEffect(() => {
    getStats();
  }, [isDark]);

  const generateChartData = () => {
    const monthlyIncome: Record<string, number> = {};
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    financesData.forEach(t => {
      if (t.type === 'income' && t.date) {
        const dateParts = t.date.split(" ");
        let monthName = "";
        if (dateParts.length >= 2) {
          monthName = dateParts[1].substring(0, 3).toLowerCase();
        }

        const matchedMonth = months.find(m => m.toLowerCase() === monthName || m.toLowerCase().startsWith(monthName));
        if (matchedMonth) {
          monthlyIncome[matchedMonth] = (monthlyIncome[matchedMonth] || 0) + Number(t.amount);
        }
      }
    });

    const definedMonths = Object.keys(monthlyIncome);
    const displayMonths = definedMonths.slice(-6);

    if (displayMonths.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    return {
      labels: displayMonths.sort((a, b) => months.indexOf(a) - months.indexOf(b)),
      datasets: [{
        data: displayMonths.map(m => monthlyIncome[m]),
        color: (opacity = 1) => `rgba(232,169,35,${opacity})`,
        strokeWidth: 2.5,
      }]
    };
  };

  const dashboardChartData = generateChartData();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={COLORS.bg} />


      {/* Full-screen background */}
      <LinearGradient
        colors={isDark ? [COLORS.bg, "#0C1530", COLORS.bg] : [COLORS.bg, "#F0F2F5", COLORS.bg]}
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
            {stats.map((stat, i) => (
              <StatCard key={stat.id} stat={stat} delay={100 + i * 120} />
            ))}
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <ChartSection chartData={dashboardChartData} />
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

