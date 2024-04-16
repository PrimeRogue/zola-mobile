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
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
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
// import ImagePicker from "react-native-image-crop-picker";
// import ImagePicker from "react-native-image-picker";

const userId = "660a2935d26d51861b4fc7fe"; // userID của người login vào, Kaito Hasei
export default function ChatScreen({ route }) {
  const { conversationId, conversationName, navigation, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageImage, setMessageImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageSent, setMessageSent] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
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

    fetchMessages();
  }, [conversationId]);
  // 4. Handle sending text message
  const handleSendTextMessage = async () => {
    // try {
    //   const storedAccessToken = await AsyncStorage.getItem("accessToken");
    //   const result = await conversationApi.sendTextMessage(
    //     conversationId,
    //     messageText,
    //     storedAccessToken
    //   );

    //   console.log("Message sent:", result);
    //   setMessageText("");
    //   // Emit the message to the server using socket
    //   socket.emit("message", messageText);

    //   // Clear the message input
    // } catch (error) {
    //   console.error("Error sending message:", error.message);
    // }
    console.log("");
  };

  const handleSendImageMessage = async () => {
    // try {
    //   const storedAccessToken = await AsyncStorage.getItem("accessToken");
    //   console.log(messageImage.name);
    //   // Gọi hàm sendImageMessage từ conversationApi
    //   const result = await conversationApi.sendImageMessage(
    //     conversationId,
    //     [messageImage.name],
    //     storedAccessToken
    //   );
    //   // Xóa nội dung của input sau khi đã gửi tin nhắn thành công
    //   setMessageImage(null);
    //   console.log("Image message sent:", result);
    //   // Emit the message to the server using socket
    //   socket.emit("message", messageImage);
    //   // Clear the message input
    // } catch (error) {
    //   console.error("Error sending message:", error.message);
    // }
    console.log("");
  };
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
            {conversationName.substring(0, 15) + "..."}
          </Text>
        </View>
        <MaterialCommunityIconsIcon name="menu" size={25} color="#fff" />
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
        {messages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((message) => {
            if (message.typeMessage === "TEXT") {
              return (
                <TextMessage
                  key={message.id}
                  content={message.content}
                  createdAt={format(new Date(message.createdAt), "HH:mm")}
                  isUser={message.userId !== userId}
                />
              );
            } else if (message.typeMessage === "IMAGE") {
              return (
                <ImageMessage
                  key={message.id}
                  content={{ uri: message.content.split(",").toString() }}
                  createdAt={format(new Date(message.createdAt), "HH:mm")}
                  isUser={message.userId !== userId}
                />
              );
            } else {
              return null; // Return null for non-text messages
            }
          })}
      </ScrollView>

      {/* Form gửi tin nhắn */}
      <View
        style={{
          backgroundColor: "white",
          width: "100vw",
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
          right: 0,
        }}
      >
        {/* Sticker button */}
        <TouchableOpacity
          onPress={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          <MaterialCommunityIconsIcon
            name="sticker-emoji"
            size={25}
            color="828282"
          />
        </TouchableOpacity>
        {/* Chứa sticker */}
        {showEmojiPicker && (
          <EmojiPicker
            style={{
              position: "absolute",
              bottom: 90,
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
            }}
            onEmojiClick={(emojiObject) => {
              setMessageText(messageText + emojiObject.emoji);
            }}
          />
        )}

        <TextInput
          style={{
            height: 40,
            margin: 15,
            marginLeft: 5,
            marginRight: 5,
            backgroundColor: "transparent",
            color: "#8C8F91",
            flexGrow: 1,
            fontSize: 18,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: 5,
          }}
          placeholder="Tin nhan"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MaterialIconsIcon name="attach-file" size={25} color="828282" />
          <TouchableOpacity
            onPress={() => document.getElementById("imageInput").click()}
          >
            <MaterialCommunityIconsIcon
              name="file-image"
              size={25}
              color="828282"
            />
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => {
                setMessageImage(event.target.files[0]);
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await handleSendTextMessage();
              // await fetchMessages();
            }}
          >
            <MaterialCommunityIconsIcon
              name="send"
              size={25}
              color={messageImage || messageText !== "" ? "teal" : "828282"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
