import React, { useCallback } from "react";
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
  FontAwesomeIcon,
  OcticonsIcon,
  EntypoIcon,
  EvilIconsIcon,
  noAvatar,
} from "../utils/IconUtils";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contactApi from "../api/ContactApi";
import authAPI from "../api/AuthApi";
import { sendNotification } from "../utils/PushNotificationUtils";
import Notification from "../components/notification/Notification";
import conversationApi from "../api/ConversationApi";
import userApi from "../api/UserApi";

export default function ContactScreen({ route }) {
  const [accessToken, setAccessToken] = useState("");
  const [contactData, setContactData] = useState([]);
  const [allFriendData, setAllFriendData] = useState([]);
  const [cloneContactData, setCloneContactData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [notification, setNotification] = useState({});
  const [userId, setUserId] = useState("");
  const [sentRequest, setSentRequest] = useState([false, []]);
  const navigation = useNavigation();
  // Tạo kênh thông báo
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const getAllFriend = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const contactData = await contactApi.getAllContact(accessToken);
      const allFriendData = await contactApi.getAllFriend(accessToken);
      const me = await userApi.getMe(accessToken);
      setUserId(me.id);
      setContactData(contactData);
      setCloneContactData(contactData);
      setAllFriendData(allFriendData);
    } catch (error) {
      console.error(error.code);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllFriend();
    }, [])
  );
  // 3. handle send friend request
  const handleSendFriendRequest = async (friendId) => {
    try {
      if (!sentRequest[1].includes(friendId)) {
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
        setSentRequest((prevState) => [true, [...prevState[1], friendId]]);
      }
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
  const handleRedirectChat = async (friendId, friendName) => {
    // fecth conversations
    const accessToken = await AsyncStorage.getItem("accessToken");
    const conversations = await conversationApi.fetchConversation(accessToken);
    const filteredItems = conversations.list.filter(
      (item) => !item.isGroup && item.participants[1].id === friendId
    );
    if (filteredItems.length !== 0) {
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
    } else {
      const data = await conversationApi.createConversation(
        [friendId],
        null,
        accessToken
      );

      if (data !== "") {
        navigation.navigate("ChatScreen", {
          conversationId: data.id,
          conversationName:
            friendName.length > 27
              ? `${friendName.substring(0, 27)}...`
              : friendName,
          userId: userId,
          navigation: navigation,
        });
      }
    }
  };

  // 5. handle delete friend
  const handleDeleteFriend = async (friendId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const data = await contactApi.removeFriend(accessToken, friendId);
      getAllFriend();
    } catch (error) {
      console.error("Error accept friend request:", error);
    }
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
          height: 65,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          background: "teal",
          padding: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          Danh bạ
        </Text>
      </View>
      {/* Content */}

      {/* Lời mời kết bạn */}
      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          paddingTop: 15,
          paddingBottom: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #ccc",
        }}
        onPress={() => navigation.navigate("FriendRequestScreen")}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "teal",
          }}
        >
          <AntDesignIcon name="addusergroup" size={18} color="#fff" />
        </View>
        <Text style={{ fontSize: 16 }}>Lời mời kết bạn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          paddingTop: 15,
          paddingBottom: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #ccc",
        }}
        onPress={toggleModal}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "teal",
          }}
        >
          <AntDesignIcon name="adduser" size={18} color="#fff" />
        </View>
        <Text style={{ fontSize: 16 }}>Gửi yêu cầu kết bạn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          paddingTop: 15,
          paddingBottom: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #ccc",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "teal",
          }}
        >
          <IoniconsIcon name="people-outline" size={18} color="#fff" />
        </View>
        <Text style={{ fontSize: 16 }}>Danh sách nhóm</Text>
      </TouchableOpacity>
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            width: "100vw",
            backgroundColor: "#ccc",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          Danh sách bạn bè
        </Text>
        {allFriendData.length === 0 && (
          <Text style={{ fontSize: 16, marginTop: 15, marginBottom: 15 }}>
            Chưa có bạn bè
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
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.friend.photoUrl && (
                  <Image
                    source={{ uri: item.friend.photoUrl }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      resizeMode: "cover",
                    }}
                  ></Image>
                )}

                {!item.friend.photoUrl && (
                  <FontAwesomeIcon
                    name="user-circle"
                    color="#A0AEC0"
                    size={50}
                  ></FontAwesomeIcon>
                )}
              </View>
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
                  {item.friend.email.length > 25
                    ? item.friend.email.substring(0, 25) + "..."
                    : item.friend.email}
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
                onPress={() =>
                  handleRedirectChat(item.friend.id, item.friend.displayName)
                }
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
                onPress={() => handleDeleteFriend(item.friend.id)}
              >
                <AntDesignIcon name="deleteuser" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      {/* Modal khi bấm vào gợi ý kết bạn  */}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        style={{ backgroundColor: "black", width: "100%", height: "100vh" }}
      >
        {/* Modal Container */}
        <View
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            zIndex: 1000,
          }}
        >
          {/* Modal Content */}
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              height: "75vh",
              borderRadius: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              display: "flex",
              flexDirection: "column",
              padding: 10,
              gap: 10,
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={toggleModal}
            >
              <IoniconsIcon name="chevron-down" size={35} color="#ccc" />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Gợi ý kết bạn
            </Text>
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
                      ? cloneContactData.filter((item) =>
                          item.email.includes(text)
                        )
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
            {/* render data */}
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
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
                          fontSize: 16,
                          fontWeight: "bold",
                          wordWrap: "break-word",
                        }}
                      >
                        {item.displayName.length > 15
                          ? item.displayName.substring(0, 15) + "..."
                          : item.displayName}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#ccc" }}>
                        {item.email.length > 20
                          ? item.email.substring(0, 20) + "..."
                          : item.email}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        sentRequest[0] && sentRequest[1].includes(item.id)
                          ? "#ccc"
                          : "teal",
                      width: 50,
                      height: 40,
                      borderRadius: 5,
                    }}
                    onPress={() => handleSendFriendRequest(item.id)}
                  >
                    <AntDesignIcon name="adduser" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
