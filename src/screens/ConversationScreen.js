import React from "react";
import { useState, useRef, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authAPI from "../api/AuthApi";
import conversationApi from "../api/ConversationApi";
import ConversationItem from "../components/conversation/ConversationItem";
const userId = "660a2935d26d51861b4fc7fe"; // userID của người login vào, Kaito Hasei
export default function ConversationScreen() {
  const [conversationData, setConversationData] = useState([]);
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState("");
  // 1. Sau khi đăng nhập --> set Token
  // * Xoá code này: code này để test
  useEffect(() => {
    const fetchDataAndSetToken = async () => {
      try {
        const data = await authAPI.login({
          email: "kaitohasei@gmail.com",
          password: "LoL@123",
        });
        setAccessToken(data.access_token);
        // Lưu access token vào AsyncStorage
        await AsyncStorage.setItem("accessToken", data.access_token);
      } catch (error) {
        console.error("Lỗi khi lưu token vào AsyncStorage:", error);
      }
    };
    fetchDataAndSetToken();
  }, []);

  // 2. Fetch danh sách conversation khi accessToken thay đổi
  useEffect(() => {
    const fetchConversationList = async () => {
      try {
        const conversations = await conversationApi.fetchConversation(
          accessToken
        );

        setConversationData(conversations.list);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error.code);
      }
    };

    fetchConversationList();
  }, [accessToken]);

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/*Header  */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          background: "teal",
          padding: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <AntDesignIcon name="search1" size={18} color="#fff" />
          <Text style={{ color: "#eee", fontSize: 18 }}>Search</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <AntDesignIcon name="plus" size={18} color="#fff" />
        </View>
      </View>
      {conversationData.length !== 0 ? (
        conversationData.map((conversation, index) => (
          <ConversationItem
            key={index}
            conversation={conversation}
            userId={userId}
            navigation={navigation}
          ></ConversationItem>
        ))
      ) : (
        <Text
          style={{
            textAlign: "center",
            padding: 10,
            paddingTop: 15,
            fontSize: 16,
          }}
        >
          Chưa có cuộc trò chuyện nào
        </Text>
      )}
    </View>
  );
}
