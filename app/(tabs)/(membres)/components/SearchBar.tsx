/**
 * eTaiza – Search Bar Component
 * Stack: React Native Expo + Tamagui
 */

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Input, View } from "tamagui";
import { COLORS, useAppColors } from "../../../utils/styles";

interface SearchBarProps {
  query: string;
  setQuery: (text: string) => void;
}

export function SearchBar({ query, setQuery }: SearchBarProps) {
  const COLORS = useAppColors();
  return (
    <View style={[styles.searchWrap, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <Input
        style={styles.searchInput}
        placeholder="Rechercher un membre..."
        placeholderTextColor={COLORS.textMuted as any}
        color={COLORS.textPrimary as any}
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && (
        <Pressable onPress={() => setQuery("")}>
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 14,
    backgroundColor: COLORS.bgCard, borderRadius: 14, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.borderBlue,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14, paddingVertical: 12, fontFamily: "DMSans_400Regular" },
  clearIcon: { fontSize: 14, color: COLORS.textMuted, paddingLeft: 8 },
});
