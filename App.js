import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStackNavigator from "./src/navigation/AuthStackNavigator";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import ChatScreen from "./src/screens/ChatScreen";
import AuthScreen from "./src/screens/AuthScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FriendRequestScreen from "./src/screens/FriendRequestScreen";
import TooltipMessage from "./src/components/message/TooltipMessage";

const Stack = createStackNavigator();
const screenComponents = {
  // AuthStackNavigator,
  AuthScreen,
  LoginScreen,
  RegisterScreen,
  BottomTabNavigator,
  ChatScreen,
  FriendRequestScreen,
};
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        {Object.keys(screenComponents).map((screenName) => (
          <Stack.Screen
            key={screenName}
            name={screenName}
            component={screenComponents[screenName]}
            options={{ headerShown: false }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
    // <TooltipMessage></TooltipMessage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
