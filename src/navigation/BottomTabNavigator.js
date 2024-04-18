// Navigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/AntDesign";
import ConversationScreen from "../screens/ConversationScreen";
import ContactScreen from "../screens/ContactScreen";
import PersonalScreen from "../screens/PersonalScreen";
const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Tin nhắn") {
            iconName = "message1";
          } else if (route.name === "Danh bạ") {
            iconName = "contacts";
          } else if (route.name === "Cá nhân") {
            iconName = "user";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "teal",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Tin nhắn"
        component={ConversationScreen}
        options={{ headerShown: false }}
        initialParams={
          {
            //   email: email,
          }
        }
      />
      <Tab.Screen
        name="Danh bạ"
        component={ContactScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={PersonalScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
