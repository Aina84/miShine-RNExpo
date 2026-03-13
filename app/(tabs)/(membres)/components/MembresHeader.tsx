/**
 * miShine – Membres Header Component
 */

import React, { useEffect, useState } from "react";
import { Animated, StyleSheet} from "react-native";
import { Text, View } from "tamagui";
import { COLORS } from "../../../utils/styles";
import { db } from "@/lib/database/db";
import { sheeps } from "@/lib/database/schema";


interface MembresHeaderProps {
  headerAnim: Animated.Value;
  onLoad: ()=>void
}

export function MembresHeader({ onLoad, headerAnim }: MembresHeaderProps) {
  const [totalMembers, setTotalMembers] = useState<Number>(0)

  useEffect(()=>{
    const getMembersCount = async () => {
      const total = await db.$count(sheeps)
      setTotalMembers(total)
    }
    getMembersCount()
  }, [onLoad])
  
  return (
    <Animated.View style={[styles.header, { opacity: headerAnim }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Membres</Text>
          <Text style={styles.headerSub}>Registre des membres</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>Total: {totalMembers.valueOf()}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: "transparent",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerTitle: { fontFamily: "PlayfairDisplay_700Bold", fontSize: 28, fontWeight: "800" },
  headerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  countBadge: {
    backgroundColor: "rgba(232,169,35,0.12)", borderWidth: 1,
    borderColor: "rgba(232,169,35,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  countText: { fontSize: 11, color: COLORS.gold, fontWeight: "700" },
});
