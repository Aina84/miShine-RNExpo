import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";

import { db } from "@/lib/database/db";
import { rapports } from "@/lib/database/schema";
import { desc } from "drizzle-orm";
import { COLORS } from "../../utils/styles";
import { AddReportCard } from "./components/AddReportCard";
import { EmptyState } from "./components/EmptyState";
import { RapportsFab } from "./components/RapportsFab";
import { RapportsHeader } from "./components/RapportsHeader";
import { ReportCard } from "./components/ReportCard";
import { ReportFilters } from "./components/ReportFilters";
import { StatsRow } from "./components/StatsRow";

const FILTERS = ["Tous", "Culte", "Dîme", "Offrande", "Autre"];

export default function RapportsScreen() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [reportList, setReportList] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { icon: "📋", val: "0", lbl: "Total" },
    { icon: "⛪", val: "0", lbl: "Cultes" },
    { icon: "💰", val: "0", lbl: "Finances" },
    { icon: "📅", val: "0", lbl: "Autres" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const headerFade = useRef(new Animated.Value(0)).current;

  const fetchReports = async () => {
    try {
      const data = await db.select().from(rapports).orderBy(desc(rapports.date));
      setReportList(data);

      // Calcul des stats
      const total = data.length;
      const cultes = data.filter(r => r.type === 'culte').length;
      const finances = data.filter(r => r.type === 'dime' || r.type === 'offrande').length;
      const autres = total - cultes - finances;

      setStats([
        { icon: "📋", val: total.toString(), lbl: "Total" },
        { icon: "⛪", val: cultes.toString(), lbl: "Cultes" },
        { icon: "💰", val: finances.toString(), lbl: "Finances" },
        { icon: "📅", val: autres.toString(), lbl: "Autres" },
      ]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    fetchReports();
  }, []);

  const filtered = reportList.filter((r) => {
    if (activeFilter === "Tous") return true;
    return r.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <LinearGradient colors={[COLORS.bg, "#0C1530", COLORS.bg]} style={StyleSheet.absoluteFill} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <RapportsHeader fadeAnim={headerFade} />

        {/* Stats Row */}
        <StatsRow stats={stats} headerFade={headerFade} />

        {/* Filters */}
        <ReportFilters filters={FILTERS} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Reports */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((r, i) => (
            <ReportCard
              key={r.id}
              report={{
                ...r,
                typeLbl: r.type.charAt(0).toUpperCase() + r.type.slice(1),
                amount: (Number(r.offering) + Number(r.dim)) > 0 ? `${(Number(r.offering) + Number(r.dim)).toLocaleString()} Ariary` : "—"
              }}
              index={i}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <RapportsFab onPress={() => setShowAddModal(true)} />

      {/* Add Report Modal */}
      <AddReportCard
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onReportAdded={fetchReports}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 20 },
});
