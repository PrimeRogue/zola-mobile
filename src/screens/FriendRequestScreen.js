import React, { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Formik } from "formik";
import * as yup from "yup";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contactApi from "../api/ContactApi";

const FriendRequestScreen = ({ navigation }) => {
  useEffect(() => {
    const getFriendRequest = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        console.log("get access token:", accessToken);
        const data = await contactApi.getFriendRequest(accessToken);
        console.log(data);
      } catch (error) {
        console.error(error.code);
      }
    };

    getFriendRequest();
  }, []);
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
        <Text style={{ fontSize: 18, color: "white" }}>Lời mời kết bạn</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FriendRequestScreen;
