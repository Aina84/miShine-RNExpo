/**
 * eTaiza – Membres Floating Action Button (FAB) Component
 * Stack: React Native Expo + Tamagui + expo-linear-gradient
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../utils/styles";

export function MembresFab({onPress}: {onPress: ()=>void}) {
  return (
    <View style={styles.fabWrap}>
      <Pressable style={styles.fab} onPress={onPress}>
        <LinearGradient
          colors={[COLORS.goldLight, COLORS.goldDim]}
          style={styles.fabGrad}
        >
          <Text style={styles.fabIcon}>➕</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrap: { position: "absolute", bottom:50, alignSelf:'center', width:"17%"},
  fab: { overflow: "hidden", borderRadius:"50%"},
  fabGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16 },
  fabIcon: { fontSize: 18 },
});
