// screens/AddGameScreen.js
import React, { useState, useContext, useEffect } from "react";
// TODO: replace with your real Google Custom Search credentials
const GOOGLE_API_KEY = "AIzaSyAl9PUQsYkydEqlUPhQ50fZlync_WJczNI";
const GOOGLE_CX = "715976fdfa93448f2";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  TextInput,
  Button,
  Checkbox,
  Portal,
  Dialog,
  List
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GameContext } from "../contexts/GameContext";

const AddGameScreen = ({ navigation }) => {
  const { addGame } = useContext(GameContext);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState(""); // set by the modal
  const [notes, setNotes] = useState(""); // formerly "genre", now "notes"
  const [imageUrl, setImageUrl] = useState("");
  const [hasManual, setHasManual] = useState(false);
  const [hasBox, setHasBox] = useState(false);
  const [isPlatformDialogVisible, setPlatformDialogVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [imageResults, setImageResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const resetForm = () => {
    setTitle("");
   
    setNotes("");
    setImageUrl("");
    
  };

  const handleAddGame = () => {
    if (!title.trim() || !platform.trim()) {
      Alert.alert("Missing Information", "Please enter at least the title and select a platform.");
      return;
    }
    console.log("Final platform selection:", platform);
    // Pass notes instead of genre to your context
    addGame({ title, platform, notes, imageUrl, hasManual, hasBox });
    navigation.goBack();
  };

  // Handler for "Add Another Game" – adds the game and resets the form.
  const handleAddAnotherGame = async () => {
    if (!title.trim() || !platform.trim()) {
      Alert.alert("Missing Information", "Please enter at least the title and select a platform.");
      return;
    }
    // Replace `genre` with your `notes` field here
    await addGame({ title, platform, notes, imageUrl, hasManual, hasBox });
    Alert.alert("Game Added", "You can now add another game.");
    resetForm();
  };

  async function fetchBoxArt() {
    if (!title.trim() || !platform.trim()) {
      Alert.alert("Missing Information", "Enter title and platform first.");
      return;
    }
    setIsSearching(true);
    const query = encodeURIComponent(`${title} ${platform} box art`);
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&searchType=image&num=10&q=${query}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log("Google Image Search response:", json);
      if (json.error) {
        Alert.alert("Image Search Error", json.error.message);
        setIsSearching(false);
        return;
      }
      setImageResults(json.items || []);
    } catch (err) {
      Alert.alert("Image Search Failed", err.message);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    if (imagePickerVisible) {
      fetchBoxArt();
    } else {
      setImageResults([]);
    }
  }, [imagePickerVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Add New Game</Text>
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

        {/* Notes Field (replacing Genre) */}
        <View style={styles.formGroup}>
          <TextInput
            mode="outlined"
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline  // Allows for multiple lines of text
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <TextInput
            mode="outlined"
            label="Cover Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Button
            icon="image-search"
            mode="outlined"
            onPress={() => setImagePickerVisible(true)}
            style={{ marginBottom: 15 }}
          >
            Fetch Box Art
          </Button>
        </View>
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

        <Button mode="contained" onPress={handleAddGame} style={styles.button}>
          Add Game and View Collection
        </Button>

        <Button
          mode="contained"
          onPress={handleAddAnotherGame}
          style={[styles.button, styles.addAnotherButton]}
          color="#F39C12"
>
  Add Another Game
</Button>

        
      </ScrollView>

      {/* Image Picker Modal */}
      <Portal>
        <Dialog
          visible={imagePickerVisible}
          onDismiss={() => setImagePickerVisible(false)}
        >
          <Dialog.Title>Choose Box Art</Dialog.Title>
          <Dialog.Content style={{ height: 300 }}>
            {isSearching ? (
              <ActivityIndicator />
            ) : imageResults.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No images found. Try again?
              </Text>
            ) : (
              <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {imageResults.map(item => (
                  <TouchableOpacity
                    key={item.link}
                    onPress={() => {
                      setImageUrl(item.link);
                      setImagePickerVisible(false);
                    }}
                    style={{ margin: 5 }}
                  >
                    <Image
                      source={{ uri: item.image.thumbnailLink }}
                      style={{ width: 100, height: 100 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={fetchBoxArt}>
              {imageResults.length ? "Refresh" : "Search"}
            </Button>
            <Button onPress={() => setImagePickerVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#705E4E",
    textAlign: "center"
  },
  formGroup: {
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: "#705E4E"
  },
  input: {
    backgroundColor: "#fff"
  },
  platformSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    justifyContent: "space-between"
  },
  platformText: {
    fontSize: 16,
    color: "#705E4E"
  },
  platformPlaceholder: {
    fontSize: 16,
    color: "#A7A7A7"
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#705E4E"
  },
  button: {
    marginTop: 20,
    backgroundColor: "#C7924e",
  },
  addAnotherButton: {
    backgroundColor: "#705E4E",
    marginTop: 10, // Adjust spacing as desired
  },
  
});

export default AddGameScreen;
