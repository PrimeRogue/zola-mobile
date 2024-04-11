import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Formik } from "formik";
import * as yup from "yup";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import authAPI from "../api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Please enter email"),
  password: yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const [loginError, setLogInError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const data = await authAPI.login(values);
      const accessToken = data.access_token;
      // Lưu access token vào AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);
      // Xử lý dữ liệu đăng nhập ở đây
      console.log("Login successful:", data);
      navigation.navigate("HomeScreen");
    } catch (error) {
      const errorCode = error?.code; // Lấy mã lỗi từ đối tượng lỗi được ném ra
      // Xử lý lỗi nếu có
      if (errorCode === "wrong-password" || errorCode === "user-not-found") {
        setLogInError("Invalid email or password");
      } else if (errorCode === "email-not-verify") {
        setLogInError("Email is not verified");
      } else if (errorCode === "invalid-credential") {
        setLogInError("Invalid credential");
      } else {
        // Xử lý các trường hợp lỗi khác
        console.error("Unknown error:", error);
      }
    }
    setLoading(false);
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
          Please enter email and password to log in
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
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                margin: 15,
                backgroundColor: "transparent",
                color: "#8C8F91",
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
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                margin: 15,
                marginTop: 0,
                backgroundColor: "transparent",
                color: "#8C8F91",
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
