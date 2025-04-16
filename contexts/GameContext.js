// contexts/GameContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);

  // Load games from AsyncStorage when the provider mounts
  useEffect(() => {
    const loadGamesFromStorage = async () => {
      try {
        const storedGames = await AsyncStorage.getItem("games");
        if (storedGames !== null) {
          setGames(JSON.parse(storedGames));
        }
      } catch (error) {
        console.error("Error loading games:", error);
      }
    };
    loadGamesFromStorage();
  }, []);

  // Helper function to save games to AsyncStorage
  const saveGamesToStorage = async (gamesToSave) => {
    try {
      await AsyncStorage.setItem("games", JSON.stringify(gamesToSave));
    } catch (error) {
      console.error("Error saving games:", error);
    }
  };

  // Add a new game to the context and persist it
  const addGame = async (game) => {
    const newGame = { id: Date.now().toString(), ...game };
    const updatedGames = [...games, newGame];
    setGames(updatedGames);
    await saveGamesToStorage(updatedGames);
  };

  // Delete a game from the context and update persistence
  const deleteGame = async (id) => {
    const updatedGames = games.filter((game) => game.id !== id);
    setGames(updatedGames);
    await saveGamesToStorage(updatedGames);
  };

  // Edit an existing game and update persistence
  const editGame = async (updatedGame) => {
    const updatedGames = games.map((game) =>
      game.id === updatedGame.id ? updatedGame : game
    );
    setGames(updatedGames);
    await saveGamesToStorage(updatedGames);
  };

  // Replace the entire games array with a new one
  const replaceGames = async (newGames) => {
    setGames(newGames);
    await saveGamesToStorage(newGames);
  };

  return (
    <GameContext.Provider
      value={{ games, setGames, addGame, deleteGame, editGame, replaceGames }}
    >
      {children}
    </GameContext.Provider>
  );
};
