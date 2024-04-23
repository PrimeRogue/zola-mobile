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
  TextInput,
  Dimensions,
  Modal,
} from "react-native";
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  FontAwesome5Icon,
} from "../utils/IconUtils";

import { useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contactApi from "../api/ContactApi";
import authAPI from "../api/AuthApi";
import { sendNotification } from "../utils/PushNotificationUtils";
import Notification from "../components/notification/Notification";
import conversationApi from "../api/ConversationApi";
import userApi from "../api/UserApi";

export default function MemberGroupScreen({ route }) {
  const { conversationId } = route.params;
  const [accessToken, setAccessToken] = useState("");
  const [contactData, setContactData] = useState([]);
  const [allFriendData, setAllFriendData] = useState([]);
  const [cloneContactData, setCloneContactData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [notification, setNotification] = useState({});
  const [userId, setUserId] = useState("");
  const [isDeletedMember, setIsDeletedMember] = useState(false);

  const navigation = useNavigation();
  // Tạo kênh thông báo
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // 2. Fetch danh sách Contact đề xuất
  const getConversationById = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const data = await conversationApi.fetchConversationById(
        conversationId,
        accessToken
      );
      setAllFriendData(data.participants);
    } catch (error) {
      console.error(error.code);
    }
  };
  useEffect(() => {
    getConversationById();
  }, [accessToken]);

  useEffect(() => {
    getConversationById();
    setIsDeletedMember(false);
  }, [isDeletedMember]);

  // 3. handle send friend request
  const handleSendFriendRequest = async (friendId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("get access token:", accessToken);
      const data = await contactApi.sendFriendRequest(accessToken, friendId);
      const { status } = data;
      const title =
        status === 201 ? "Friend Request Sent" : "Friend Request Pending";
      const message =
        status === 201
          ? "Your friend request has been sent successfully."
          : "Your friend request is pending.";

      // Gửi thông báo
      await sendNotification(title, message);
      setNotification({ title: title, message: message });
    } catch (error) {
      // Xử lý lỗi
      console.error("Error sending friend request:", error);

      // Gửi thông báo về lỗi
      await sendNotification("Error", "Failed to send friend request.");
      setNotification({
        title: "Error",
        message: "Failed to send friend request.",
      });
    }
  };

  // 4. Redirect chat user
  const handleRedirectChat = async (friendId) => {
    // fecth conversations
    const accessToken = await AsyncStorage.getItem("accessToken");
    const conversations = await conversationApi.fetchConversation(accessToken);
    const filteredItems = conversations.list.filter(
      (item) => !item.isGroup && item.participants[1].id === friendId
    );
    navigation.navigate("ChatScreen", {
      conversationId: filteredItems[0].id,
      conversationName:
        filteredItems[0].participants[1].displayName.length > 27
          ? `${filteredItems[0].participants[1].displayName.substring(
              0,
              27
            )}...`
          : filteredItems[0].participants[1].displayName,
      userId: userId,
      navigation: navigation,
    });
  };

  // 4. Redirect chat user
  const handleDeleteMemberGroup = async (userId) => {
    // fecth conversations
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log(`${conversationId}/group-member/${userId}`);
    const data = await conversationApi.deleteMemberGroup(
      conversationId,
      userId,
      accessToken
    );
    setIsDeletedMember(true);
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
      {notification && Object.keys(notification).length !== 0 ? (
        <Notification
          title={notification.title}
          message={notification.message}
        />
      ) : null}
      {/* Header */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "teal",
          padding: 20,
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          Thành viên trong nhóm
        </Text>
      </View>
      {/* Content */}
      {/* Danh sách bạn bè */}
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {allFriendData.length === 0 && (
          <Text style={{ fontSize: 16, marginTop: 15, marginBottom: 15 }}>
            Loading
          </Text>
        )}
        {allFriendData.map((item, index) => (
          <View
            key={index}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
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
                // source={{ uri: item.friend.photoUrl }}
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
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
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "teal",
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                }}
                onPress={() => handleRedirectChat(item.id)}
              >
                <AntDesignIcon name="message1" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "teal",
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                }}
                onPress={() => handleDeleteMemberGroup(item.id)}
              >
                <AntDesignIcon name="deleteuser" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      {/* Modal khi bấm vào gợi ý kết bạn  */}
    </KeyboardAvoidingView>
  );
}
