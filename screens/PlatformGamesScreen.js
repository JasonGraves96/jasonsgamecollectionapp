// screens/PlatformGamesScreen.js
import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GameContext } from "../contexts/GameContext";
import { PlatformImages } from "./PlatformImages"; // Ensure this file exports a dictionary mapping platform name → image

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Modified GameCard component with expand/collapse functionality
const GameCard = ({ game, navigation }) => {
  const [expanded, setExpanded] = useState(false);
  const { deleteGame } = useContext(GameContext);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Game",
      `Are you sure you want to delete "${game.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteGame(game.id)
        }
      ],
      { cancelable: true }
    );
  };

  // Determine which image to show: Use game.imageUrl if available; otherwise, use the platform image.
  const gameImageSource =
    game.imageUrl && game.imageUrl.trim() !== ""
      ? { uri: game.imageUrl }
      : PlatformImages[game.platform];

  return (
    <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.8}>
      <View style={styles.card}>
        <Text style={styles.gameTitle}>{game.title}</Text>
        <Image source={gameImageSource} style={styles.cardImage} />
        <View style={styles.cardActions}>
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color="#7FA184"
            onPress={() => navigation.navigate("EditGame", { game })}
          />
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color="#FF4500"
            onPress={confirmDelete}
          />
        </View>
        {/* Expanded Content */}
        {expanded && (
          <View style={styles.expandedContent}>
            {/* You can choose which extra details to show */}
           
            <Text style={styles.expandedText}>
              Notes: {game.notes || "No notes available."}
            </Text>
            <Text style={styles.expandedText}>
              Includes:{" "}
              {game.hasManual ? "Manual" : ""}
              {game.hasManual && game.hasBox ? " & " : ""}
              {game.hasBox ? "Box" : ""}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const PlatformGamesScreen = ({ route, navigation }) => {
  const { platform } = route.params;
  const { games } = useContext(GameContext);

  // Filter games for the selected platform and sort them alphabetically by title.
  const filteredGames = games
    .filter((game) => game.platform === platform)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color="#705E4E"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>{platform} Games</Text>
      </View>
      {filteredGames.length === 0 ? (
        <Text style={styles.noGamesText}>No games found for {platform}.</Text>
      ) : (
        <FlatList
          key="two-column"
          data={filteredGames}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gamesContainer}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <View style={{ flex: 1 }}>
                <GameCard game={item} navigation={navigation} />
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 40 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "#705E4E",
    marginLeft: 10,
  },
  gamesContainer: { padding: 16 },
  noGamesText: { textAlign: "center", marginTop: 20, color: "#705E4E" },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: "visible",
    alignItems: "center",
  },
  /*
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: { marginRight: 10 },
  gameImage: { width: 80, height: 80, borderRadius: 10 },
  */
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  cardContent: { flex: 1 },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#705E4E",
    fontFamily: "serif",
    marginBottom: 6,
  },
  actionColumn: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  // Style for expanded content
  expandedContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  expandedText: {
    fontSize: 16,
    color: "#705E4E",
    marginBottom: 4,
  },
  // The highlight effect when the card is pressed (optional since we're using toggleExpanded)
  platformCardPressed: {
    backgroundColor: "#DFF0D8",
  },
  gridItem: {
    flex: 1,
    margin: 8,
  },
});

export default PlatformGamesScreen;
