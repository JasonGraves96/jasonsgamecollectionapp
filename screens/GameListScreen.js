// screens/GameListScreen.js
import React, { useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { GameContext } from "../contexts/GameContext";
import { PlatformImages } from "./PlatformImages"; // Ensure this file exports a dictionary mapping platform → image

// PlatformCard remains unchanged except for navigation
const PlatformCard = ({ platform, gameCount, navigation }) => {
  return (
    <Pressable
      onPress={() => {
        console.log("PlatformCard pressed for:", platform);
        navigation.navigate("PlatformGames", { platform });
      }}
      style={({ pressed }) => [
        styles.platformCard,
        pressed && styles.platformCardPressed,
      ]}
    >
      <Image
        source={PlatformImages[platform] || require("../assets/logo.png")}
        style={styles.platformIcon}
      />
      <View style={styles.platformInfo}>
        <Text style={styles.platformTitle}>{platform}</Text>
        <Text style={styles.platformCount}>
          {gameCount} game{gameCount === 1 ? "" : "s"}
        </Text>
      </View>
    </Pressable>
  );
};

const GameListScreen = ({ navigation }) => {
  // Destructure both games and setGames from your context.
  const { games, setGames } = useContext(GameContext);

  // Create a mapping of platform names and the number of games associated
  const platformsMap = games.reduce((acc, game) => {
    if (game.platform) {
      acc[game.platform] = (acc[game.platform] || 0) + 1;
    }
    return acc;
  }, {});
  const uniquePlatforms = Object.keys(platformsMap).sort();

  // Export function: Write the games list as JSON to a file.
  const exportData = async () => {
    try {
      const jsonData = JSON.stringify(games, null, 2);
      const fileUri = FileSystem.documentDirectory + "games_export.json";
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      // Optionally share the file if Sharing is available.
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Export Successful", `File saved at: ${fileUri}`);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Export Error", "There was an error exporting data.");
    }
  };

  // Import function: Use DocumentPicker to select a JSON file, then read and parse it.
  const importData = async () => {
    try {
      // Use copyToCacheDirectory to ensure we get a local path we can read.
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      console.log("DocumentPicker result:", JSON.stringify(result, null, 2));

      // Check if the user canceled the selection.
      if (
        (typeof result.type === "string" && result.type === "cancel") ||
        result.canceled === true
      ) {
        Alert.alert("Import Canceled", "No file was selected.");
        return;
      }

      // Attempt to find a valid path in result.uri, result.fileCopyUri, or result.assets.
      let actualUri = result.uri || result.fileCopyUri;
      if (!actualUri && result.assets && result.assets.length > 0) {
        console.log("Inspecting result.assets[0]:", result.assets[0]);
        actualUri = result.assets[0].uri || result.assets[0].fileCopyUri || null;
      }
      console.log("Actual URI used:", actualUri);

      if (!actualUri) {
        Alert.alert("No file URI found", "Please select a valid JSON file.");
        return;
      }

      const fileContents = await FileSystem.readAsStringAsync(actualUri);
      console.log("File contents:", fileContents);

      const importedGames = JSON.parse(fileContents);
      console.log("Imported games:", importedGames);

      // Use the setter from your context to update the game list.
      setGames(importedGames);
      Alert.alert("Import Successful", "Game data has been imported.");
    } catch (error) {
      console.error("Error importing data:", error);
      Alert.alert("Import Error", "Failed to import game data.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Game Collection</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons
            name="gamepad-variant"
            size={28}
            color="#705E4E"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerText}>Platforms</Text>
        </View>

        {/* Export and Import Buttons */}
        <View style={styles.exportImportContainer}>
          <Button mode="outlined" onPress={exportData} style={styles.button}>
            Export Data
          </Button>
          <Button mode="outlined" onPress={importData} style={styles.button}>
            Import Data
          </Button>
        </View>

        <ScrollView contentContainerStyle={styles.platformsContainer}>
          {uniquePlatforms.length === 0 ? (
            <Text style={styles.noPlatformsText}>
              No games available. Add some games!
            </Text>
          ) : (
            uniquePlatforms.map((platform) => (
              <PlatformCard
                key={platform}
                platform={platform}
                gameCount={platformsMap[platform]}
                navigation={navigation}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 40 },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#7FA184",
  },
  topBarTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  mainContent: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  headerText: {
    fontSize: 24,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "#705E4E",
  },
  exportImportContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  button: { marginHorizontal: 5 },
  platformsContainer: { paddingVertical: 10 },
  noPlatformsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#705E4E",
  },
  platformCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  platformCardPressed: {
    backgroundColor: "#DFF0D8", // Light green highlight for pressed state
  },
  platformIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  platformInfo: { flex: 1 },
  platformTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#705E4E",
    fontFamily: "serif",
  },
  platformCount: {
    marginTop: 4,
    fontSize: 16,
    color: "#705E4E",
  },
});

export default GameListScreen;
