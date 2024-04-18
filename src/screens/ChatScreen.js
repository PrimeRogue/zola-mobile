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
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  OcticonsIcon,
} from "../utils/IconUtils";

import { useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import conversationApi from "../api/ConversationApi";
import TextMessage from "../components/message/TextMessage";
import { format } from "date-fns";
import ImageMessage from "../components/message/ImageMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../utils/SocketUtils";
import EmojiPicker from "emoji-picker-react";
import * as ImagePicker from "expo-image-picker";
import base64toFile from "../utils/FileUtils";
import ReplyTextMessage from "../components/message/ReplyTextMessage";
export default function ChatScreen({ route }) {
  const {
    conversationId,
    conversationName,
    navigation,
    userId,
    setIsMessagesChanged,
  } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("TEXT");
  const [selectedImages, setSelectedImages] = useState([]);
  const [dataReceived, setDataReceived] = useState({});
  const [socket, setSocket] = useState({
    rootSocket: null,
    chatSocket: null,
  });
  const [messageSent, setMessageSent] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const scrollViewRef = useRef(); // Create a ref for ScrollView
  useEffect(() => {
    // Scroll to the end of ScrollView when messages change
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  // Connect socket
  useEffect(() => {
    const chatSocket = getSocket("/chats", {
      autoConnect: false,
      forceNew: true,
      query: {
        conversationId,
      },
    });

    if (conversationId) {
      chatSocket.connect();
      setSocket((prev) => {
        return {
          ...prev,
          chatSocket,
        };
      });
    }
    console.log("Kết nối socket thành công");
    return () => {
      chatSocket.disconnect();
    };
  }, [conversationId, setSocket]);

  // 1. fecth tin nhắn sau khi có tin nhắn mới được gửi ngay lập tức
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
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);
  // 4. Handle sending text message
  const handleSendTextMessage = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const data = await conversationApi.sendTextMessage(
        conversationId,
        messageText,
        storedAccessToken
      );
    } catch (error) {
      console.error(error.message + "--" + error.code);
    }
    console.log("message type are TEXT");
  };

  const handleSendImageMessage = async () => {
    console.log("message type are IMAGE");
    try {
      const files = [];
      for (let i = 0; i < selectedImages.length; i++) {
        if (/^data:image\/jpeg;base64,/.test(selectedImages[i])) {
          // Nếu dữ liệu base64 bắt đầu bằng 'data:image/jpeg;base64,', loại bỏ phần tiêu đề
          const base64Data = selectedImages[i].replace(
            /^data:image\/jpeg;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "image.jpg");
          files.push(file);
        } else if (/^data:image\/png;base64,/.test(selectedImages[i])) {
          // Nếu dữ liệu base64 bắt đầu bằng 'data:image/png;base64,', loại bỏ phần tiêu đề
          const base64Data = selectedImages[i].replace(
            /^data:image\/png;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "image.png");
          files.push(file);
        } else {
          console.error("Invalid base64 format:", selectedImages[i]);
        }
      }

      console.log("Files converted:", files);

      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      files.forEach(async (item) => {
        const formData = new FormData();
        formData.append("images", item);
        const result = await conversationApi.sendImageMessage(
          conversationId,
          formData,
          storedAccessToken
        );
      });
    } catch (error) {
      console.error(error.message + "--" + error.code);
    }

    setMessageType("TEXT");
  };

  // 5. Xử lý các event socket
  useEffect(() => {
    if (socket.chatSocket) {
      const handleSentMessage = (data) => {
        console.log("Message sent event received:", data);
        setDataReceived(data);
        fetchMessages();
        setMessageText("");
        setSelectedImages([]);
        setShowEmojiPicker(false);
        setIsMessagesChanged(true);
      };
      const handleRevokeMessage = (data) => {
        fetchMessages();
      };
      socket.chatSocket.on("sent_message", handleSentMessage);
      socket.chatSocket.on("revoke_message", handleRevokeMessage);
      return () => {
        socket.chatSocket.off("sent_message", handleSentMessage);
      };
    }
  }, [socket.chatSocket, fetchMessages]);

  // 6. Handle Pick Images
  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });
    setSelectedImages(result.assets.map((asset) => asset.uri));
    setMessageType("IMAGE");
  };

  // 7. Handle Remove Image
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
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
            {conversationName.length > 27
              ? `${conversationName.substring(0, 27)}...`
              : conversationName}
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
          flexDirection: "column",
          marginBottom: 70,
        }}
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        inverted
      >
        {messages
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((message) => {
            if (message.content.includes("type:REPLY")) {
              return (
                <ReplyTextMessage
                  key={message.id}
                  content={{ uri: message.content.split(",").toString() }}
                  createdAt={format(new Date(message.createdAt), "HH:mm")}
                  isUser={message.userId !== userId}
                  conversationId={conversationId}
                  messageCuid={message.cuid}
                ></ReplyTextMessage>
              );
            } else if (message.typeMessage === "TEXT") {
              return (
                <TextMessage
                  key={message.id}
                  content={message.content}
                  createdAt={format(new Date(message.createdAt), "HH:mm")}
                  isUser={message.userId !== userId}
                  messageCuid={message.cuid}
                  conversationId={conversationId}
                />
              );
            } else if (message.typeMessage === "IMAGE") {
              return (
                <ImageMessage
                  key={message.id}
                  content={{ uri: message.content.split(",").toString() }}
                  createdAt={format(new Date(message.createdAt), "HH:mm")}
                  isUser={message.userId !== userId}
                  conversationId={conversationId}
                  messageCuid={message.cuid}
                />
              );
            } else {
              return null;
            }
          })}
      </ScrollView>

      {/* Form gửi tin nhắn */}
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
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
            paddingBottom: 0,
            justifyContent: "space-between",
            gap: 15,
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
              marginTop: 15,
              marginBottom: 15,
              backgroundColor: "transparent",
              color: "#8C8F91",
              flexGrow: 1,
              fontSize: 18,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              paddingLeft: 5,
            }}
            placeholder="Nhập tin nhắn"
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
          />
          <TouchableOpacity onPress={handlePickImages}>
            <MaterialCommunityIconsIcon
              name="file-image"
              size={25}
              color="828282"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              messageType === "IMAGE"
                ? handleSendImageMessage
                : handleSendTextMessage
            }
          >
            <MaterialCommunityIconsIcon
              name="send"
              size={25}
              color={
                (selectedImages.length !== 0) | (messageText !== "")
                  ? "teal"
                  : "828282"
              }
            />
          </TouchableOpacity>
        </View>
        {/* Preview ảnh */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            backgroundColor: "white",
          }}
        >
          {selectedImages.map((imageUri, index) => (
            <View
              style={{
                width: "33%",
                height: 120,
                borderWidth: 1,
                borderColor: "#ccc",
                backgroundColor: "white",
              }}
            >
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: "100%" }}
              ></Image>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                }}
                onPress={() => handleRemoveImage(index)}
              >
                <OcticonsIcon name="x-circle-fill" size={25} color="#ccc" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
