import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as DocumentPicker from "expo-document-picker";
import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  FontAwesome5Icon,
  OcticonsIcon,
  EntypoIcon,
  EvilIconsIcon,
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
import VideoMessage from "../components/message/VideoMessage";
import FileMessage from "../components/message/FileMessage";
export default function ChatScreen({ route }) {
  const {
    conversationId,
    conversationName,
    navigation,
    userId,
    setIsMessagesChanged,
    photoUrl,
  } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("TEXT");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dataReceived, setDataReceived] = useState({});
  const [me, setMe] = useState(null);

  const [socket, setSocket] = useState({
    rootSocket: null,
    chatSocket: null,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollViewRef = useRef();
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  // Connect socket chatting
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
    return () => {
      chatSocket.disconnect();
    };
  }, [conversationId, setSocket]);

  // Fetch tin nhắn
  const fetchMessages = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      console.log(storedAccessToken);
      const data = await conversationApi.fetchMessagesByConversationId(
        conversationId,
        storedAccessToken
      );
      setMessages(data.message.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  // Fecth tin nhắn lần đầu khi nhấn vào conversation
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  // Handle sending text message
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
  };

  const handleSendImageMessage = async () => {
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

  const handleSendFileMessage = async () => {
    try {
      const files = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        if (/^data:application\/pdf;base64,/.test(selectedFiles[i])) {
          // If the base64 data starts with 'data:application/pdf;base64,', remove the header
          const base64Data = selectedFiles[i].replace(
            /^data:application\/pdf;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "file.pdf");
          files.push(file);
        } else if (/^data:application\/msword;base64,/.test(selectedFiles[i])) {
          // If the base64 data starts with 'data:application/msword;base64,', remove the header
          const base64Data = selectedFiles[i].replace(
            /^data:application\/msword;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "file.doc");
          files.push(file);
        } else if (
          /^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/.test(
            selectedFiles[i]
          )
        ) {
          const base64Data = selectedFiles[i].replace(
            /^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "file.docx");
          files.push(file);
        } else if (/^data:video\/mp4;base64,/.test(selectedFiles[i])) {
          // If the base64 data starts with 'data:video/mp4;base64,', remove the header
          const base64Data = selectedFiles[i].replace(
            /^data:video\/mp4;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "video.mp4");
          files.push(file);
        } else if (/^data:text\/plain;base64,/.test(selectedFiles[i])) {
          const base64Data = selectedFiles[i].replace(
            /^data:text\/plain;base64,/,
            ""
          );
          const file = base64toFile(base64Data, "file.txt");
          files.push(file);
        } else {
          console.error("Invalid base64 format:", selectedFiles[i]);
        }
      }

      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      files.forEach(async (item) => {
        const formData = new FormData();
        formData.append("file", item);
        const data = await conversationApi.sendFileMessage(
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
  // Xử lý các event socket
  useEffect(() => {
    if (socket.chatSocket) {
      const handleSentMessage = (data) => {
        console.log("Message sent event received:", data);
        setDataReceived(data);
        fetchMessages();
        setMessageText("");
        setSelectedImages([]);
        setSelectedFiles([]);
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
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        multiple: true, // Allow multiple selection
      });

      if (result.type === "cancel") {
        return;
      }

      setSelectedFiles(result.assets.map((asset) => asset.uri));
      setMessageType("FILE");
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };
  // 7. Handle Remove Image
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleRemoveFile = (index) => {
    const newFile = [...selectedFiles];
    newFile.splice(index, 1);
    setSelectedFiles(newFile);
  };

  // 8. Handle Send Message
  const handleSendMessage = () => {
    if (messageType === "IMAGE") {
      handleSendImageMessage();
    } else if (messageType === "TEXT") {
      handleSendTextMessage();
    } else if (messageType === "FILE") {
      handleSendFileMessage();
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case "video/mp4":
        return (
          <MaterialIconsIcon name="video-library" size={70} color="#000" />
        );
      case "application/pdf":
        return <AntDesignIcon name="pdffile1" size={70} color="#F79B3F" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/x-excel":
      case "application/x-msexcel":
      case "application/x-ms-excel":
      case "application/xls":
      case "application/xlsx":
        return <AntDesignIcon name="exclefile1" size={70} color="#1F7145" />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.ms-word":
      case "application/word":
      case "application/x-msword":
        return <AntDesignIcon name="wordfile1" size={70} color="#1E90FF" />;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return <AntDesignIcon name="pptfile1" size={70} color="#C43E1C" />;
      case "image/gif":
        return <MaterialIconsIcon name="gif" size={70} color="#1E90FF" />;
      case "application/zip":
        return <AntDesignIcon name="database" size={70} color="#EFC95A" />;
      case "application/x-rar-compressed":
      case "application/rar":
      case "application/x-rar":
      case "application/x-rar-compressed":
        return <AntDesignIcon name="database" size={70} color="#EFC95A" />;
      case "text/plain":
        return <AntDesignIcon name="filetext1" size={70} color="#ccc" />;
      case "image/png":
      case "image/jpeg":
        return <AntDesignIcon name="jpgfile1" size={70} color="#EFC95A" />;
      default:
        return <AntDesignIcon name="folder1" size={70} color="#000" />;
    }
  };

  const renderFileName = (content) => {
    let extractFileName1 = content.split("/").reverse();
    let extractFileName2 = extractFileName1[0].split("-").reverse();
    return extractFileName2[0];
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
          height: 65,
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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VideoCallScreen", {
                navigation,
                conversationId,
              })
            }
          >
            <MaterialCommunityIconsIcon name="video" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MemberGroupScreen", {
                navigation,
                conversationId,
                userId,
                userName: "aa",
              })
            }
          >
            <MaterialCommunityIconsIcon name="menu" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
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
                  photoUrl={photoUrl}
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
                  photoUrl={photoUrl}
                />
              );
            } else if (message.typeMessage === "VIDEO") {
              return (
                <VideoMessage
                  key={message.id}
                  content={message.content.split(",").toString()}
                  createdAt={format(new Date(message.createdAt), "HH:mm")}
                  isUser={message.userId !== userId}
                  conversationId={conversationId}
                  messageCuid={message.cuid}
                  photoUrl={photoUrl}
                />
              );
            } else if (message.typeMessage === "FILE") {
              let extractFileName3 = renderFileName(
                message.content.split(",").toString()
              );
              let extractFileExtension = extractFileName3.split(".").reverse();
              let fileExtension = extractFileExtension[0];
              if (fileExtension === "mp4")
                return (
                  <VideoMessage
                    key={message.id}
                    content={message.content.split(",").toString()}
                    createdAt={format(new Date(message.createdAt), "HH:mm")}
                    isUser={message.userId !== userId}
                    conversationId={conversationId}
                    messageCuid={message.cuid}
                    photoUrl={photoUrl}
                  />
                );
              else
                return (
                  <FileMessage
                    key={message.id}
                    content={message.content.split(",").toString()}
                    createdAt={format(new Date(message.createdAt), "HH:mm")}
                    isUser={message.userId !== userId}
                    conversationId={conversationId}
                    messageCuid={message.cuid}
                    photoUrl={photoUrl}
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
            gap: 10,
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
          <TouchableOpacity onPress={handlePickFile}>
            <MaterialCommunityIconsIcon
              name="file-upload"
              size={25}
              color="828282"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImages}>
            <MaterialCommunityIconsIcon
              name="file-image"
              size={25}
              color="828282"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendMessage}>
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
          {selectedFiles.map((fileUri, index) => {
            const getFileTypeFromUri = (uri) => {
              if (uri.startsWith("data:")) {
                const fileType = uri.substring(5, uri.indexOf(";"));
                return fileType;
              } else {
                return null;
              }
            };
            const fileType = getFileTypeFromUri(fileUri);

            console.log(fileType);
            return (
              <View
                style={{
                  width: "33%",
                  height: 120,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "white",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                  }}
                  onPress={() => handleRemoveFile(index)}
                >
                  <OcticonsIcon name="x-circle-fill" size={25} color="#ccc" />
                </TouchableOpacity>
                {renderIcon(fileType)}
              </View>
            );
          })}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
