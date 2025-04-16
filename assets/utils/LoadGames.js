import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export async function loadGamesFromTxt() {
  try {
    console.log("loadGamesFromTxt: Starting");
    
    // If LoadGames.js is in the same folder as 'assets', this path might be './assets/games.txt'
    // If it's next to 'assets' in the project root, require("./assets/games.txt") is correct.
    // LoadGames.js
const asset = Asset.fromModule(require("./assets/games.json"));

    
    await asset.downloadAsync();
    console.log("Asset downloaded, localUri =", asset.localUri);

    const fileContents = await FileSystem.readAsStringAsync(asset.localUri);
    console.log("File contents:", fileContents); // <-- DEBUG: See the raw text

    const games = JSON.parse(fileContents); // <-- This might fail if the text isn't valid JSON
    console.log("Parsed games length:", games.length);

    return games;
  } catch (error) {
    console.error("Error loading games from file:", error);
    return [];
  }
}
