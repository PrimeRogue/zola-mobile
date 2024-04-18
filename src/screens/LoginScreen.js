import React, { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Formik } from "formik";
import * as yup from "yup";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import authAPI from "../api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Validate Login Form
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Please enter email"),
  password: yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const [loginError, setLogInError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { access_token } = await authAPI.login(values);
      await AsyncStorage.setItem("accessToken", access_token);
      navigation.navigate("BottomTabNavigator");
    } catch (error) {
      const errorCode = error?.code;
      const errorMessages = {
        "wrong-password": "Invalid email or password",
        "user-not-found": "Invalid email or password",
        "email-not-verify": "Email is not verified",
        "invalid-credential": "Invalid credential",
      };
      setLogInError(errorMessages[errorCode] || "Unknown error");
      if (!errorMessages[errorCode]) {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
      }}
      behavior="padding"
    >
      {/* Header */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 20,
          padding: 20,
          backgroundColor: "teal",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: "white" }}>Đăng nhập</Text>
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          padding: 15,
          backgroundColor: "#F1F5F3",
        }}
      >
        <Text style={{ fontSize: 16 }}>
          Nhập email và password để đăng nhập
        </Text>
      </View>
      <Spinner visible={loading} />

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{ width: "100%" }}>
            <TextInput
              style={{
                height: 40,
                margin: 15,
                backgroundColor: "transparent",
                color: "#8C8F91",
                flexGrow: 1,
                fontSize: 18,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                paddingLeft: 5,
              }}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={{
                height: 40,
                margin: 15,
                marginTop: 0,
                backgroundColor: "transparent",
                color: "#8C8F91",
                flexGrow: 1,
                fontSize: 18,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                paddingLeft: 5,
              }}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Password"
              secureTextEntry
            />
            {touched.email || touched.password ? (
              <Text style={{ color: "red", marginLeft: 15, marginBottom: 15 }}>
                {errors.email || errors.password}
                {loginError}
              </Text>
            ) : null}
            <Text
              style={{
                color: "teal",
                fontWeight: 500,
                fontSize: 14,
                marginLeft: 15,
                marginBottom: 15,
              }}
            >
              Recover password
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "teal",
                margin: 15,
                padding: 10,
                borderRadius: 5,
                width: "30%",
                display: "flex",
                alignItems: "center",
              }}
              onPress={handleSubmit}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
