import { useAppColors, useAppStyles } from "@/app/utils/styles";
import { activityService } from "@/lib/services/activityService";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated } from "react-native";
import { Text, View } from "tamagui";

export function RecentActivity() {
  const styles = useAppStyles();
  const COLORS = useAppColors();
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchActivities = useCallback(async () => {
    const data = await activityService.getRecentActivities(5);
    setActivitiesList(data);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [fetchActivities])
  );


  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "À l'instant";
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      if (diffDays === 1) return `Hier`;
      return `Il y a ${diffDays} jours`;
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <Animated.View style={[styles.activityCard, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Activité Récente</Text>
      {activitiesList.length === 0 ? (
        <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginVertical: 20 }}>Aucune activité récente</Text>
      ) : (
        activitiesList.map((item, i) => (
          <View
            key={item.id || i}
            style={[
              styles.activityItem,
              i < activitiesList.length - 1 && styles.activityItemBorder,
            ]}
          >
            <View style={styles.activityIconWrapper}>
              <Text style={styles.activityItemIcon}>{item.icon}</Text>
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityLabel}>{item.text}</Text>
              <Text style={styles.activityTime}>{formatTime(item.time)}</Text>
            </View>
          </View>
        ))
      )}
    </Animated.View>
  );
}
