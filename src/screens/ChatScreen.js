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
import io from "socket.io-client";
import Lightbox from "react-native-lightbox";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialIconsIcon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-web";
import conversationApi from "../api/ConversationApi";
import TextMessage from "../components/message/TextMessage";
import { format } from "date-fns";
import ImageMessage from "../components/message/ImageMessage";
const socket = io("ws://localhost:8081/");
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ChatScreen({ route }) {
  const { conversationId, conversationName, navigation } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef(); // Create a ref for ScrollView
  // 1. fecth tin nhắn sau khi có conversationId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem("accessToken");
        const data = await conversationApi.fetchMessagesByConversationId(
          conversationId,
          storedAccessToken
        );
        setMessages(data.message.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages(); // Gọi hàm fetchMessages khi component được mount hoặc conversationId thay đổi
  }, [conversationId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  // useEffect(() => {
  //   socket.emit("joinConversation", conversationId);

  //   socket.on("message", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     socket.emit("leaveConversation", conversationId);
  //     socket.off("message");
  //   };
  // }, [conversationId]);

  // const sendMessage = () => {
  //   if (messageText.trim() !== "") {
  //     socket.emit("sendMessage", { conversationId, content: messageText });
  //     setMessageText("");
  //   }
  // };
  return (
    <View
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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesignIcon name="arrowleft" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
            {conversationName}
          </Text>
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
          <IoniconsIcon name="call-outline" size={22} color="#fff" />
          <IoniconsIcon name="videocam-outline" size={30} color="#fff" />
          <MaterialCommunityIconsIcon name="menu" size={25} color="#fff" />
        </View>
      </View>
      {/* Content */}
      <ScrollView
        style={{
          backgroundColor: "#E2E9F1",
          width: "100%",
          padding: 15,
          display: "flex",
          marginBottom: 70,
        }}
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        inverted
      >
        {messages.map((message) => {
          console.log(message);
          if (message.typeMessage === "TEXT") {
            return (
              <TextMessage
                key={message.id} // Ensure each child component has a unique key
                content={message.content}
                createdAt={format(new Date(message.createdAt), "HH:mm")}
                isUser={message.userId === "660a2935d26d51861b4fc7fe"}
              />
            );
          } else if (message.typeMessage === "IMAGE") {
            return (
              <ImageMessage
                key={message.id} // Ensure each child component has a unique key
                content={{ uri: message.content.split(",").toString() }}
                createdAt={format(new Date(message.createdAt), "HH:mm")}
                isUser={message.userId === "660a2935d26d51861b4fc7fe"}
              />
            );
          } else {
            return null; // Return null for non-text messages
          }
        })}

        {/* Tin nhắn dạng text */}

        {/* Tin nhắn dạng hình ảnh */}
      </ScrollView>
      {/* Chat input */}
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#eee",
          padding: 10,
          paddingTop: 0,
          justifyContent: "space-between",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <MaterialCommunityIconsIcon
          name="sticker-emoji"
          size={25}
          color="828282"
        />
        <TextInput
          style={{
            height: 40,
            margin: 15,
            backgroundColor: "transparent",
            color: "#8C8F91",
            flexGrow: 1,
            fontSize: 18,
          }}
          placeholder="Tin nhan"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 15,
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIconsIcon
            name="dots-horizontal"
            size={25}
            color="828282"
          />
          <MaterialIconsIcon name="keyboard-voice" size={25} color="828282" />
          <TouchableOpacity>
            <MaterialCommunityIconsIcon
              name="file-image"
              size={25}
              color="828282"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
