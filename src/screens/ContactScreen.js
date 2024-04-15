import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useRef, useEffect } from "react";
import {
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
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialIconsIcon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import conversationApi from "../api/ConversationApi";
import TextMessage from "../components/message/TextMessage";
import { format } from "date-fns";
import ImageMessage from "../components/message/ImageMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../utils/SocketUtils";
import EmojiPicker from "emoji-picker-react";
import contactApi from "../api/ContactApi";
import authAPI from "../api/AuthApi";
// import { messagesData } from "./testData";
// import ImagePicker from "react-native-image-crop-picker";
// import ImagePicker from "react-native-image-picker";

const userId = "660a2935d26d51861b4fc7fe"; // userID của người login vào, Kaito Hasei
export default function ContactScreen({ route }) {
  const [accessToken, setAccessToken] = useState("");
  const [contactData, setContactData] = useState([]);
  const [cloneContactData, setCloneContactData] = useState([]);

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
    const getAllContact = async () => {
      try {
        const data = await contactApi.getAllContact(accessToken);
        setContactData(data);
        setCloneContactData(data);
      } catch (error) {
        console.error(error.code);
      }
    };

    getAllContact();
  }, [accessToken]);
  return (
    <KeyboardAvoidingView
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      {/* Header */}
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
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          Bạn bè
        </Text>
        <AntDesignIcon name="adduser" size={25} color="#fff" />
      </View>
      {/* Content */}

      {/* Modal khi bấm vào gợi ý kết bạn  */}
      <View
        style={{
          width: "90%",
          backgroundColor: "white",
          height: "80vh",
          borderRadius: 5,
          borderColor: "#ccc",
          borderWidth: 1,
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Gợi ý kết bạn</Text>
        {/* Tìm kiếm */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 5,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <TextInput
            style={{
              height: 40,
              borderColor: "#ccc",
              borderWidth: 1,
              backgroundColor: "transparent",
              color: "#8C8F91",
              flexGrow: 1,
              paddingLeft: 5,
              paddingRight: 5,
              borderRadius: 5,
            }}
            onChangeText={(text) => {
              const searchedContactData =
                text.trim() !== ""
                  ? cloneContactData.filter((item) => item.email.includes(text))
                  : cloneContactData;
              setContactData(searchedContactData);
            }}
            // onBlur={handleBlur("email")}
            // value={values.email}
            placeholder="Nhập email"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "teal",
              width: 50,
              borderRadius: 5,
            }}
          >
            <AntDesignIcon name="search1" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Danh sách gợi ý */}
        <View style={{ width: "100%", display: "column", gap: 10 }}>
          {contactData.map((item, index) => (
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
                  // source={{item.photo}}}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    resizeMode: "cover",
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
                <View
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      wordWrap: "break-word",
                    }}
                  >
                    {item.displayName.substring(0, 15) + "..."}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#ccc" }}>
                    {item.email.substring(0, 20)}
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
              >
                <AntDesignIcon name="adduser" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
