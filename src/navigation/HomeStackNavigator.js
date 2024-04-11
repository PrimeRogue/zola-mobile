import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SafeAreaView } from "react-native"; // Import SafeAreaView
import LoginScreen from "../screens/LoginScreen";
import AuthScreen from "../screens/AuthScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ConversationScreen from "../screens/ConversationScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();
const screenComponents = {
  ConversationScreen,
  ChatScreen,
};

const SafeScreenComponent = (props) => {
  const ScreenComponent = screenComponents[props.route.name];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenComponent {...props} />{" "}
    </SafeAreaView>
  );
};

const HomeStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {Object.keys(screenComponents).map((screenName) => (
          <Stack.Screen
            key={screenName}
            name={screenName}
            component={SafeScreenComponent}
            options={{ headerShown: false }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStackNavigator;
