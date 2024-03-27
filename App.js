import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from "./src/screens/Auth";
const Stack = createStackNavigator();

export default function App() {
  return (
    <Auth></Auth>
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="LogIn">
    //     {Object.keys(screenComponents).map((screenName) => (
    //       <Stack.Screen
    //         key={screenName}
    //         name={screenName}
    //         component={screenComponents[screenName]}
    //         options={{ headerShown: false }}
    //       />
    //     ))}
    //   </Stack.Navigator>
    // </NavigationContainer>
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
