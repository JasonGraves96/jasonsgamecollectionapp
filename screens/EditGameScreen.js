// screens/EditGameScreen.js
import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button, Checkbox, Portal, Dialog, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GameContext } from "../contexts/GameContext";

const EditGameScreen = ({ navigation, route }) => {
  // Expect the game data to be passed in route.params
  const { game } = route.params;
  const { editGame } = useContext(GameContext);

  const [title, setTitle] = useState(game.title);
  const [platform, setPlatform] = useState(game.platform);
  const [notes, setNotes] = useState(game.notes);
  const [imageUrl, setImageUrl] = useState(game.imageUrl);
  const [hasManual, setHasManual] = useState(game.hasManual);
  const [hasBox, setHasBox] = useState(game.hasBox);
  const [isPlatformDialogVisible, setPlatformDialogVisible] = useState(false);

  // List of allowed platforms, sorted alphabetically.
  const allowedPlatforms = [
    "3DO",
    "Atari 2600",
    "Atari 5200",
    "Atari 7800",
    "Atari Jaguar",
    "Atari Lynx",
    "Colecovision",
    "Hyperscan",
    "Intellivision",
    "Nintendo NES",
    "Super Nintendo",
    "Game Boy",
    "Game Boy Advance",
    "Nintendo 64",
    "Nintendo GameCube",
    "Nintendo DS",
    "Nintendo 3DS",
    "Wii",
    "Wii U",
    "Nintendo Switch",
    "Nintendo Switch 2",
    "PlayStation",
    "PlayStation 2",
    "PlayStation 3",
    "PlayStation 4",
    "PlayStation 5",
    "Sega Master System",
    "Sega Genesis",
    "Sega Game Gear",
    "Sega Saturn",
    "Sega Dreamcast",
    "Steam",
    "PC",
    "Xbox",
    "Xbox 360",
    "Xbox One",
    "Xbox Series X/S"
  ].sort();

  const handleUpdateGame = () => {
    if (!title.trim() || !platform.trim()) {
      Alert.alert("Missing Information", "Please enter at least the title and select a platform.");
      return;
    }
    const updatedGame = {
      id: game.id,
      title,
      platform,
      notes,
      imageUrl,
      hasManual,
      hasBox,
    };
    editGame(updatedGame);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Edit Game</Text>
        <View style={styles.formGroup}>
          <TextInput
            mode="outlined"
            label="Game Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>

        {/* Custom Platform Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Platform</Text>
          <TouchableOpacity
            style={styles.platformSelector}
            onPress={() => setPlatformDialogVisible(true)}
          >
            <Text style={platform ? styles.platformText : styles.platformPlaceholder}>
              {platform || "Select a Platform..."}
            </Text>
            <MaterialCommunityIcons name="menu-down" size={20} color="#705E4E" />
          </TouchableOpacity>
        </View>

        {/* Notes Field */}
        <View style={styles.formGroup}>
          <TextInput
            mode="outlined"
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Cover Image URL */}
        <View style={styles.formGroup}>
          <TextInput
            mode="outlined"
            label="Cover Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
          />
        </View>

        {/* Checkboxes for Manual and Box */}
        <View style={styles.checkboxContainer}>
          <Checkbox.Item
            label="Manual"
            status={hasManual ? "checked" : "unchecked"}
            onPress={() => setHasManual(!hasManual)}
            labelStyle={styles.checkboxLabel}
          />
          <Checkbox.Item
            label="Box"
            status={hasBox ? "checked" : "unchecked"}
            onPress={() => setHasBox(!hasBox)}
            labelStyle={styles.checkboxLabel}
          />
        </View>

        <Button mode="contained" onPress={handleUpdateGame} style={styles.button}>
          Update Game
        </Button>
      </ScrollView>

      {/* Platform Selector Modal */}
      <Portal>
        <Dialog
          visible={isPlatformDialogVisible}
          onDismiss={() => setPlatformDialogVisible(false)}
        >
          <Dialog.Title>Select a Platform</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 250 }}>
              {allowedPlatforms.map((p) => (
                <List.Item
                  key={p}
                  title={p}
                  onPress={() => {
                    setPlatform(p);
                    setPlatformDialogVisible(false);
                  }}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#705E4E", textAlign: "center" },
  formGroup: { marginBottom: 15 },
  label: { marginBottom: 5, fontSize: 16, color: "#705E4E" },
  input: { backgroundColor: "#fff" },
  platformSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    justifyContent: "space-between"
  },
  platformText: { fontSize: 16, color: "#705E4E" },
  platformPlaceholder: { fontSize: 16, color: "#A7A7A7" },
  checkboxContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  checkboxLabel: { fontSize: 16, color: "#705E4E" },
  button: { marginTop: 20, backgroundColor: "#7FA184" }
});

export default EditGameScreen;
