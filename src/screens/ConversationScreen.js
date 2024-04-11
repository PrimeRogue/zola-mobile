import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useRef, useEffect } from "react";
import { formatDistance } from "date-fns";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import getConversationList from "../api/ConversationApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  formatConversationName,
  getConversationAvatar,
} from "../utils/ConversationUtils";
import authAPI from "../api/AuthApi";
import conversationApi from "../api/ConversationApi";

export default function ConversationScreen() {
  const [conversationsList, setConversationsList] = useState([]);
  const navigation = useNavigation();
  // 1. Sau khi đăng nhập --> Lưu token
  useEffect(() => {
    const fetchDataAndSetToken = async () => {
      try {
        const data = await authAPI.login({
          email: "kaitohasei@gmail.com",
          password: "123456789",
        });
        const accessToken = data.access_token;
        // Lưu access token vào AsyncStorage
        await AsyncStorage.setItem("accessToken", accessToken);
      } catch (error) {
        console.error("Lỗi khi lưu token vào AsyncStorage:", error);
      }
    };
    fetchDataAndSetToken();
  }, []);

  // 2. Fetch danh sách conversation, truyền vào token
  useEffect(() => {
    const fetchConversationList = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem("accessToken");
        if (!storedAccessToken) {
          console.log("Không tìm thấy accessToken trong AsyncStorage");
          return;
        }
        const conversations = await conversationApi.fetchConversation(
          storedAccessToken
        );

        setConversationsList(conversations.list);
        console.log(conversations.list);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
      }
    };

    fetchConversationList();
  }, []);

  // Gọi hàm để lấy danh sách cuộc trò chuyện khi cần
  const userId = "660a2935d26d51861b4fc7fe";
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/*Search  */}
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
          <MaterialCommunityIconsIcon
            name="qrcode-scan"
            size={18}
            color="#fff"
          />
          <AntDesignIcon name="plus" size={18} color="#fff" />
        </View>
      </View>
      {/* Tab change */}
      <View
        style={{
          width: "100%",
          paddingLeft: 15,
          paddingRight: 15,
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "flex-start",
          gap: 30,
          backgroundColor: "white",
        }}
      >
        <Text
          style={{
            borderBottom: "1px solid black",
            fontSize: 16,
            fontWeight: "bold",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          Focused
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            paddingTop: 10,
            paddingBottom: 10,
            color: "#6E6E6E",
          }}
        >
          Other
        </Text>
      </View>
      {/* Component box tin nhắn, 3 loại: hệ thống, nhóm,  người bth*/}
      {conversationsList.map((conversation, index) => (
        <TouchableOpacity
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingLeft: 5,
            alignItems: "center",
            borderBlockColor: "#ccc",
            borderBottomWidth: 1,
            backgroundColor: "white",
          }}
          key={index}
          onPress={() =>
            navigation.navigate("ChatScreen", {
              conversationId: conversation.id,
              conversationName: formatConversationName(conversation, userId),
              navigation: navigation,
            })
          }
        >
          <Image
            source={getConversationAvatar(conversation, userId)}
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              resizeMode: "cover",
              margin: 15,
              marginRight: 20,
              borderWidth: 2,
              borderColor: "#ccc",
            }}
          />
          <TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 500 }}>
              {formatConversationName(conversation, userId)}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 500, color: "#848C8F" }}>
              {`${userId === conversation.latestMessage.userId ? "you: " : ""}${
                conversation?.latestMessage?.typeMessage === "TEXT"
                  ? conversation.latestMessage.content
                  : `Sent attached ${conversation?.latestMessage?.typeMessage?.toLowerCase()}`
              }`}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 450,
              color: "#848C8F",
              position: "absolute",
              right: 15,
              top: 15,
            }}
          >
            {formatDistance(new Date(conversation?.updatedAt), new Date())}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
