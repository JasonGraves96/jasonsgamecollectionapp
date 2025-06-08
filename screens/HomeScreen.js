// screens/HomeScreen.js
import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from "react-native-paper";
import { GameContext } from "../contexts/GameContext";


export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const { games } = useContext(GameContext); // Use real game data
  const navigation = useNavigation();

  // Filter games from context based on the search term
  const filteredGames =
    searchTerm.trim().length > 0
      ? games.filter((game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      <Text style={styles.welcomeText}>
        Welcome to{"\n"}Jason's Game Collection App
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          label="Search Games"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {/* Display search results only when searchTerm is not empty */}
      {searchTerm.trim().length > 0 && (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <TouchableOpacity
                key={game.id ?? index}
                onPress={() =>
                  navigation.navigate("Collection", {
                    screen: "GameList",
                    params: { selectedGameId: game.id },
                  })
                }
              >
                <Text style={styles.gameTitle}>
                  {game.title} – {game.platform}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.gameTitle}>No games found.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20, // overall container padding
    paddingTop: 20,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: "center",
    color: "#705E4E",
    fontFamily: "serif",
    marginBottom: 20,
  },
  searchContainer: {
    alignSelf: "stretch",
    marginHorizontal: 40, // space on both sides for the search bar
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
  },
  // For the list container, add a horizontal margin of 30
  listContainer: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  gameTitle: {
    fontSize: 18, // increased font size for search results
    color: "#705E4E",
    marginVertical: 5,
  },
});
