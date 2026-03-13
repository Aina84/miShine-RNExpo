/**
 * eTaiza – Finances Screen
 * Stack: React Native Expo + Tamagui + expo-linear-gradient + react-native-chart-kit
 */

import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { useAppTheme } from "@/lib/context/ThemeContext";
import { financeRepository } from "@/lib/repository/databaseRepositories";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { AddFinanceCard } from "./components/AddFinanceCard";
import { ChartCard } from "./components/ChartCard";
import { FinanceDetailCard } from "./components/FinanceDetailCard";
import { FinancesFab } from "./components/FinancesFab";
import { FinancesHeader } from "./components/FinancesHeader";
import { HeroTotalCard } from "./components/HeroTotalCard";
import { TransactionItem, TransactionItemType } from "./components/TransactionItem";
import { TypeFilters } from "./components/TypeFilters";


const { width: SCREEN_W } = Dimensions.get("window");
const TYPE_FILTERS = [
  { key: "all", label: "Tout", icon: "📊" },
  { key: "dime", label: "Dîme", icon: "💚" },
  { key: "offrande", label: "Offrande", icon: "🙏" },
  { key: "don", label: "Don", icon: "🎁" },
  { key: "depense", label: "Dépense", icon: "💸" },
];

export default function FinancesScreen() {
  const COLORS = useAppColors();
  const { isDark } = useAppTheme();
  const appStyles = useAppStyles();

  const [activeType, setActiveType] = useState("all");
  const [transactions, setTransactions] = useState<TransactionItemType[]>([]);
  const [isAddCardVisible, setAddCardVisible] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;

  const [selectedFinance, setSelectedFinance] = useState<any | null>(null);
  const [showFinanceDetail, setShowFinanceDetail] = useState(false);


  const fetchTransactions = async () => {
    try {
      const data = await financeRepository.findAll();
      setTransactions(data.reverse() as unknown as TransactionItemType[]);
    } catch (error) {
      console.error("Failed to fetch finances:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, delay: 100, useNativeDriver: true, tension: 70, friction: 12 }),
    ]).start();
  }, []);

  const filtered = transactions.filter((t) => {
    if (activeType === "all") return true;
    if (activeType === "depense") return t.type === "expense";
    return t.category?.toLowerCase().includes(activeType);
  });

  const handleFinancePress = (finance: any) => {
    setSelectedFinance(finance);
    setShowFinanceDetail(true);
  };


  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

  const generateChartData = () => {
    const monthlyIncome: Record<string, number> = {};
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    transactions.forEach(t => {
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

    const data = months.map(m => monthlyIncome[m] || 0);
    return {
      labels: months,
      datasets: [{ data }]
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={COLORS.bg} />
      <LinearGradient colors={isDark ? [COLORS.bg, "#0C1530", COLORS.bg] : [COLORS.bg, "#F0F2F5", COLORS.bg]} style={StyleSheet.absoluteFill} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <FinancesHeader headerFade={headerFade} />

        {/* Hero Card */}
        <HeroTotalCard totalIncome={totalIncome} totalExpense={totalExpense} heroSlide={heroSlide} />

        {/* Chart */}
        <ChartCard chartData={generateChartData()} screenWidth={SCREEN_W} />

        {/* Filters */}
        <TypeFilters typeFilters={TYPE_FILTERS} activeType={activeType} setActiveType={setActiveType} />

        {/* Transactions list */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: COLORS.textPrimary }]}>Récentes Transactions</Text>
          {filtered.map((t, i) => (
            <TransactionItem key={t.id || i} item={t} index={i} onPress={() => handleFinancePress(t)} />
          ))}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ color: COLORS.textMuted }}>Aucune transaction trouvée</Text>
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <FinancesFab onPress={() => setAddCardVisible(true)} />

      <AddFinanceCard
        visible={isAddCardVisible}
        onClose={() => setAddCardVisible(false)}
        onFinanceAdded={() => {
          setAddCardVisible(false);
          fetchTransactions();
        }}
      />

      <FinanceDetailCard
        open={showFinanceDetail}
        onOpenChange={setShowFinanceDetail}
        finance={selectedFinance}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 20,
  },
  section: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  }
});
