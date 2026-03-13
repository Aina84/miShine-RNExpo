/**
 * eTaiza – Chart Card Component
 * Stack: React Native Expo + Tamagui + react-native-chart-kit
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { COLORS, useAppColors } from "../../../utils/styles";

interface ChartCardProps {
  screenWidth: number;
  chartData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
}

export function ChartCard({ screenWidth, chartData }: ChartCardProps) {
  const COLORS = useAppColors();
  return (
    <View style={[styles.chartCard, { backgroundColor: COLORS.bgCard, borderColor: COLORS.borderBlue }]}>
      <Text style={styles.chartTitle}>Évolution mensuelle (k Ar)</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 64}
        height={150}
        yAxisLabel=""
        yAxisSuffix="ar"
        chartConfig={{
          backgroundGradientFrom: "#0E1A38",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#0E1A38",
          backgroundGradientToOpacity: 0,
          color: (opacity = 1) => `rgba(232,169,35,${opacity})`,
          labelColor: () => COLORS.textSecondary,
          barPercentage: 0.55,
          fillShadowGradientFrom: COLORS.gold,
          fillShadowGradientFromOpacity: 0.9,
          fillShadowGradientTo: COLORS.goldDim,
          fillShadowGradientToOpacity: 0.4,
          propsForBackgroundLines: { stroke: "rgba(74,127,229,0.1)", strokeDasharray: "4,4" },
          decimalPlaces: 0,
        }}
        style={styles.barChart}
        showValuesOnTopOfBars={false}
        withInnerLines={true}
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: COLORS.bgCard, borderRadius: 18,
    padding: 16, borderWidth: 1, borderColor: COLORS.borderBlue, paddingBottom: 30
  },
  chartTitle: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 12, },
  barChart: { marginLeft: -8, borderRadius: 12 },
});
