// screens/GameDetailScreen.js
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GameDetailScreen = ({ route }) => {
  // Retrieve the game object passed by navigation
  const { game } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {game.imageUrl ? (
          <Image source={{ uri: game.imageUrl }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons name="image-off-outline" size={100} color="#ccc" />
          </View>
        )}
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.info}>Platform: {game.platform}</Text>
        <Text style={styles.info}>Genre: {game.genre || "N/A"}</Text>
        {game.notes && <Text style={styles.info}>Notes: {game.notes}</Text>}
        <Text style={styles.info}>
          {game.hasManual ? "Includes Manual" : "No Manual"}{"\n"}
          {game.hasBox ? "Includes Box" : "No Box"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    padding: 20,
    alignItems: "center"
  },
  coverImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 20
  },
  placeholderImage: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#705E4E",
    textAlign: "center",
    marginBottom: 10
  },
  info: {
    fontSize: 18,
    color: "#705E4E",
    marginBottom: 10,
    textAlign: "center"
  }
});

export default GameDetailScreen;
