// screens/StatsScreen.js
import React, { useContext } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, View, Dimensions } from "react-native";
import { GameContext } from "../contexts/GameContext";

import { PieChart } from "react-native-chart-kit";

// Hard-coded platform color mapping for stats chart
const PLATFORM_COLORS = {
  "3DO": "#FFD700",
  "Atari 2600": "#8B4513",
  "Atari 5200": "#A0522D",
  "Atari 7800": "#D2691E",
  "Atari Jaguar": "#5C4033",
  "Atari Lynx": "#CD853F",
  "Colecovision": "#C0C0C0",
  "Hyperscan": "#00FFFF",
  "Intellivision": "#800020",
  "Nintendo NES": "#FF0000",
  "Super Nintendo": "#800080",
  "Game Boy": "#808080",
  "Game Boy Advance": "#9370DB",
  "Nintendo 64": "#90EE90",
  "Nintendo GameCube": "#483D8B",
  "Nintendo DS": "#B22222",
  "Nintendo 3DS": "#FF6347",
  "Wii": "#FFFFFF",
  "Wii U": "#ADD8E6",
  "Nintendo Switch": "#FF4500",
  "Nintendo Switch 2": "#DC143C",
  "PlayStation": "#A9A9A9",
  "PlayStation 2": "#0000CD",
  "PlayStation 3": "#1E90FF",
  "PlayStation 4": "#87CEEB",
  "PlayStation 5": "#00008B",
  "Sega Master System": "#8B0000",
  "Sega Genesis": "#000000",
  "Sega Game Gear": "#6A5ACD",
  "Sega Saturn": "#000080",
  "Sega Dreamcast": "#FFA500",
  "Steam": "#D3D3D3",
  "PC": "#F5F5DC",
  "Xbox": "#107C10",
  "Xbox 360": "#33A02C",
  "Xbox One": "#006400",
  "Xbox Series X/S": "#228B22"
};

export default function StatsScreen() {
  const { games } = useContext(GameContext);

  const totalGames = games.length;
  const boxed = games.filter(g => g.hasBox).length;
  const manual = games.filter(g => g.hasManual).length;

  // Count by platform
  const byPlatform = games.reduce((acc, g) => {
    acc[g.platform] = (acc[g.platform] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for PieChart
  const chartData = Object.entries(byPlatform).map(([platform, count]) => ({
    name: platform,
    count,
    color: PLATFORM_COLORS[platform] || "#705E4E",
    legendFontColor: "#705E4E",
    legendFontSize: 10
  }));
  const screenWidth = Dimensions.get("window").width - 80;
  const chartConfig = {
    color: (opacity = 1) => `rgba(112, 94, 78, ${opacity})`,
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Collection Statistics</Text>

        <View style={[styles.section, styles.chartContainer, { alignItems: "center" }]}>
          <Text style={[styles.sectionTitle, styles.totalGamesTitle]}>
            Total Games
          </Text>
          <Text style={[styles.value, styles.totalGamesValue]}>
            {totalGames}
          </Text>
        </View>

        <View style={[styles.section, styles.chartContainer]}>
          <Text style={styles.sectionTitle}>Boxed vs Manuals</Text>
          <Text style={styles.value}>
            Boxed: {boxed} ({((boxed/totalGames)*100).toFixed(1)}%)
          </Text>
          <Text style={styles.value}>
            With Manual: {manual} ({((manual/totalGames)*100).toFixed(1)}%)
          </Text>
        </View>

        <View style={[styles.section, styles.chartContainer]}>
          <Text style={styles.sectionTitle}>Platform Distribution</Text>
          <View style={{ alignItems: "center" }}>
            <PieChart
              data={chartData}
              width={screenWidth}
              height={300}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              center={[40, 0]}
              hasLegend={false}
            />
            <View style={styles.legendContainer}>
              {chartData.map(item => (
                <View key={item.name} style={styles.legendItem}>
                  <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>
                    {((item.count / totalGames) * 100).toFixed(0)}% {item.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.chartContainer]}>
          <Text style={styles.sectionTitle}>Games by Platform</Text>
          {Object.entries(byPlatform).map(([plat, count]) => (
            <Text key={plat} style={styles.value}>
              {plat}: {count}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#705E4E",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#705E4E",
  },
  value: {
    fontSize: 16,
    marginBottom: 3,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    marginRight: 4,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    color: "#705E4E",
  },
  totalGamesTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalGamesValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
});