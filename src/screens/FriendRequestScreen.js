import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Formik } from "formik";
import * as yup from "yup";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contactApi from "../api/ContactApi";
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  FontAwesome5Icon,
  OcticonsIcon,
  EntypoIcon,
  EvilIconsIcon,
  FeatherIcon,
} from "../utils/IconUtils";
import authAPI from "../api/AuthApi";
const FriendRequestScreen = ({ navigation }) => {
  const [friendRequestData, setFriendRequestData] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  // render danh sách yêu cầu kết bạn
  const getFriendRequest = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const data = await contactApi.getFriendRequest(accessToken);
      setFriendRequestData(data);
      console.log(data);
    } catch (error) {
      console.error(error.code);
    }
  };
  useEffect(() => {
    getFriendRequest();
  }, [accessToken]);

  const handleAcceptFriendRequest = async (friendId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const data = await contactApi.acceptFriendRequest(accessToken, friendId);
      getFriendRequest();
    } catch (error) {
      console.error("Error accept friend request:", error);
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
        <Text style={{ fontSize: 18, color: "white" }}>Lời mời kết bạn</Text>
      </View>
      {friendRequestData &&
        friendRequestData.map((item, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.photoUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  resizeMode: "cover",
                  backgroundColor: "#ccc",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    wordWrap: "break-word",
                  }}
                >
                  {item.friend.displayName.length > 15
                    ? item.friend.displayName.substring(0, 15) + "..."
                    : item.friend.displayName}
                </Text>
                <Text style={{ fontSize: 16, color: "#ccc" }}>
                  {item.friend.email.length > 28
                    ? item.friend.email.substring(0, 28) + "..."
                    : item.friend.email}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "teal",
                width: 50,
                height: 40,
                borderRadius: 5,
              }}
              onPress={() => handleAcceptFriendRequest(item.id)}
            >
              <FeatherIcon name="user-check" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
    </KeyboardAvoidingView>
  );
};

export default FriendRequestScreen;
