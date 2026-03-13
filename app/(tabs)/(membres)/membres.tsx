import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

import { MemberCard } from "./components/MemberCard";
import { MemberDetailCard } from "./components/MemberDetailCard";
import { MemberFilters } from "./components/MemberFilters";
import { MembresFab } from "./components/MembresFab";
import { MembresHeader } from "./components/MembresHeader";
import { SearchBar } from "./components/SearchBar";

import { AddSheepCard } from "@/components/shared/AddSheepCard";
import { useAppTheme } from "@/lib/context/ThemeContext";
import { db } from "@/lib/database/db";
import { sheeps } from "@/lib/database/schema";
import { useAppColors, useAppStyles } from "../../utils/styles";

const FILTERS = ["Tous", "Actifs", "Inactifs", 'Chorals', 'Securités', 'Interceseurs', 'Accueils', 'Diakona', 'Assistants', 'Staffs', 'Tsotra'];

export default function MembresScreen() {
  const COLORS = useAppColors();
  const { isDark } = useAppTheme();
  // We use useAppStyles but we also have local StyleSheet for native components
  const appStyles = useAppStyles();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [members, setMembers] = useState<any[]>([])
  const [showAddSheepCard, setShowAddSheepCard] = useState<boolean | null>(null)
  const [OnUserAdded, setOnUserAdded] = useState<boolean | null>(null)

  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showMemberDetail, setShowMemberDetail] = useState(false);

  useEffect(() => {
    async function fetchMember() {
      try {
        const data = await db.select().from(sheeps).all();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    }
    fetchMember();
    setOnUserAdded(null);
  }, [OnUserAdded])

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const filtered = members.filter((r) => {
    const matchesFilter = activeFilter === "Tous" || r.role?.toLowerCase() === activeFilter.toLowerCase();
    const matchesQuery = !query || r.name?.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleMemberPress = (member: any) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={COLORS.bg} />
      <LinearGradient colors={isDark ? [COLORS.bg, "#0C1530", COLORS.bg] : [COLORS.bg, "#F0F2F5", COLORS.bg]} style={StyleSheet.absoluteFill} />

      <AddSheepCard
        visible={showAddSheepCard == true}
        onClose={() => setShowAddSheepCard(null)}
        onUserAdded={() => { setShowAddSheepCard(null); setOnUserAdded(true) }}
      ></AddSheepCard>

      <MembresHeader onLoad={() => { }} headerAnim={headerAnim} />

      <SearchBar query={query} setQuery={setQuery} />

      <MemberFilters filters={FILTERS} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <MemberCard
            item={item}
            index={index}
            onPress={handleMemberPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>Aucun membre trouvé</Text>
          </View>
        }
        ListFooterComponent={
          <Text style={[styles.listFooter, { color: COLORS.textMuted }]}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
          </Text>
        }
      />
      <MembresFab onPress={() => { setShowAddSheepCard(true) }} />

      <MemberDetailCard
        open={showMemberDetail}
        onOpenChange={setShowMemberDetail}
        member={selectedMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  listFooter: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 12,
    opacity: 0.6,
  }
});
