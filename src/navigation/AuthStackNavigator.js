import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginScreen from "../screens/LoginScreen";
import AuthScreen from "../screens/AuthScreen";
import RegisterScreen from "../screens/RegisterScreen";
const Stack = createStackNavigator();
const screenComponents = {
  AuthScreen,
  LoginScreen,
  RegisterScreen,
  //  ForgotPasswordScreen: quên mật khẩu
  //  ConfirmAccountScreen: xác nhận tài khoản
};
const AuthStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
  );
};

export default AuthStackNavigator;
