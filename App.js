// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GameProvider } from "./contexts/GameContext";
import HomeScreen from "./screens/HomeScreen";
import AddGameScreen from "./screens/AddGameScreen";
import GameListScreen from "./screens/GameListScreen";
import PlatformGamesScreen from "./screens/PlatformGamesScreen";
import EditGameScreen from "./screens/EditGameScreen"; // Ensure this file exists

// Create a Stack Navigator for the Collection flow
const CollectionStack = createStackNavigator();

function CollectionStackScreen() {
  return (
    <CollectionStack.Navigator screenOptions={{ headerShown: false }}>
      <CollectionStack.Screen name="GameList" component={GameListScreen} />
      <CollectionStack.Screen name="PlatformGames" component={PlatformGamesScreen} />
      <CollectionStack.Screen name="EditGame" component={EditGameScreen} />
    </CollectionStack.Navigator>
  );
}

// Create the bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <GameProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#7FA184",
              tabBarInactiveTintColor: "#A7A7A7"
            }}
          >
            {/* Collection Tab with a nested stack for GameList, PlatformGames and EditGame */}
            <Tab.Screen
              name="Collection"
              component={CollectionStackScreen}
              options={{
                tabBarLabel: "Collection",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="view-list" color={color} size={size} />
                )
              }}
            />
            {/* Home Tab */}
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" color={color} size={size} />
                )
              }}
            />
            {/* Add Game Tab */}
            <Tab.Screen
              name="AddGame"
              component={AddGameScreen}
              options={{
                tabBarLabel: "Add Game",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
                )
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </GameProvider>
    </PaperProvider>
  );
}
